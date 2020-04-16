import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  RichUtils,
  Modifier,
  EditorState,
  SelectionState,
} from '@bufferapp/draft-js';
import DraftjsEditor from '@bufferapp/draft-js-plugins-editor';
import createMentionPlugin from '@bufferapp/draft-js-mention-plugin';
import createEmojiPlugin from '@bufferapp/draft-js-emoji-plugin';
import '@bufferapp/draft-js-emoji-plugin/lib/plugin.css';
import twitterText from 'twitter-text';
import AppActionCreators from '../action-creators/AppActionCreators';
import ComposerActionCreators from '../action-creators/ComposerActionCreators';
import NotificationActionCreators from '../action-creators/NotificationActionCreators';
import WebAPIUtils from '../utils/WebAPIUtils';
import CompositeNestableDecorator from '../utils/draft-js-custom-plugins/draft-decorator/CompositeNestableDecorator';
import createShortLinkPlugin from '../utils/draft-js-custom-plugins/short-link';
import createUnshortenedLinkPlugin from '../utils/draft-js-custom-plugins/unshortened-link';
import createLinkDecoratorPlugin from '../utils/draft-js-custom-plugins/link';
import createMentionDecoratorPlugin from '../utils/draft-js-custom-plugins/mention';
import createHashtagDecoratorPlugin from '../utils/draft-js-custom-plugins/hashtag';
import createHighlighterPlugin from '../utils/draft-js-custom-plugins/highlighter';
import getAutocompleteSuggestionsPosition from '../utils/draft-js-custom-plugins/autocomplete/utils/positionSuggestions';
import TwitterAutocompleteSuggestionsEntry from '../utils/draft-js-custom-plugins/autocomplete/TwitterMentionSuggestionsEntry';
import TwitterHashtagAutocompleteSuggestionsEntry from '../utils/draft-js-custom-plugins/autocomplete/TwitterHashtagSuggestionsEntry';
import FacebookAutocompleteSuggestionsEntry from '../utils/draft-js-custom-plugins/autocomplete/FacebookMentionSuggestionsEntry';
import createPrepopulatedMentionPlugin from '../utils/draft-js-custom-plugins/prepopulated-autocomplete-mention';
import createPrepopulatedHashtagPlugin from '../utils/draft-js-custom-plugins/prepopulated-autocomplete-hashtag';
import createImportedFacebookMentionPlugin from '../utils/draft-js-custom-plugins/imported-facebook-mention-entities';
import createInspectSelectionPlugin from '../utils/draft-js-custom-plugins/inspect-selection';
import { NotificationScopes, QueueingTypes } from '../AppConstants';

import styles from './css/Editor.css';
import twitterAutocompleteStyles from '../utils/draft-js-custom-plugins/autocomplete/TwitterAutocomplete.css';
import twitterHashtagAutocompleteStyles from '../utils/draft-js-custom-plugins/autocomplete/TwitterHashtagAutocomplete.css';
import facebookAutocompleteStyles from '../utils/draft-js-custom-plugins/autocomplete/FacebookAutocomplete.css';
import { getDraftCharacterCount } from '../stores/ComposerStore';

class Editor extends React.Component {
  static propTypes = {
    draft: PropTypes.object.isRequired,
    isComposerExpanded: PropTypes.bool.isRequired,
    shouldEnableFacebookAutocomplete: PropTypes.bool.isRequired,
    visibleNotifications: PropTypes.array.isRequired,
    profiles: PropTypes.array,
    shouldAutoFocus: PropTypes.bool,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    hasAttachmentGlance: PropTypes.bool,
    attachmentGlanceHasNoThumbnail: PropTypes.bool,
    hasLinkAttachment: PropTypes.bool,
    usesImageFirstLayout: PropTypes.bool,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    shouldAutoFocus: false,
    onFocus: () => {},
    placeholder: 'What would you like to share?',
  };

  constructor(props) {
    super(props);
    this.editorPlugins = null;
    this.editorPluginsComponents = null;
    this.editorPluginsUtils = null;
  }

  state = {
    autocompleteSearchQuery: '',
    autocompleteSuggestions: [],
    hashtagAutocompleteSearchQuery: '',
    hashtagAutocompleteSuggestions: [],
  };

  componentWillMount() {
    const {
      editorPlugins,
      editorPluginsComponents,
      editorPluginsUtils,
    } = this.createEditorPlugins();
    this.editorPlugins = editorPlugins;
    this.editorPluginsComponents = editorPluginsComponents;
    this.editorPluginsUtils = editorPluginsUtils;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forceDecoratorsRerender) {
      nextProps.draft.forceDecoratorsRerender = false; // Mutating through shared reference
      this.refs.textZone.rerenderDecorators();
    }
  }

  componentDidUpdate() {
    /**
     * Autofocusing is slightly delayed so that the underlying DraftjsEditor
     * component has the time to initialize entirely before the focus event
     * makes it mutate its EditorState. See #11466
     */
    if (this.props.shouldAutoFocus) {
      setTimeout(() => this.refs.textZone && this.refs.textZone.focus(), 0);
    }
  }

  onKeyDown = e => {
    // Space/Enter: parse links
    if (e.key === ' ' || e.key === 'Enter') {
      this.parseDraftTextLinks();
      // Backspace: parse links, if not in the process of backspacing through a link
    } else if (e.key === 'Backspace') {
      setImmediate(() => {
        const characterBefore = this.editorPluginsUtils.getCharacterBeforeSelectionStart();
        const hasCharacterBefore = characterBefore !== null;
        const isCharacterBeforeWhitespace = twitterText.regexen.spaces.test(
          characterBefore
        );

        if (!hasCharacterBefore || isCharacterBeforeWhitespace)
          this.parseDraftTextLinks();
      });
    }
  };

  onPaste = () => this.parseDraftTextLinks();

  onDrop = () => this.parseDraftTextLinks();

  onCut = () => this.parseDraftTextLinks();

  onClick = e => {
    e.preventDefault();
    this.props.onFocus(e);
  };

  onEditorStateChange = editorState => {
    // Only update editorState when necessary to prevent a rare race condition with
    // draft-js-mention-plugin, but still re-render whenever onEditorStateChange is
    // called because the nested AutocompleteSuggestions components need to in order
    // for keyboard navigation within suggestions to work
    const hasActuallyChanged = editorState !== this.props.draft.editorState;
    if (!hasActuallyChanged) {
      this.forceUpdate();
      return;
    }

    ComposerActionCreators.updateDraftEditorState(
      this.props.draft.id,
      editorState
    );
  };

  onFocus = e => this.props.onFocus(e);

  onAutocompleteSearchChange = (() => {
    let currentValue;

    return ({ value }, searchType = 'mentions') => {
      const searchQueryKey =
        searchType === 'mentions'
          ? 'autocompleteSearchQuery'
          : 'hashtagAutocompleteSearchQuery';

      const suggestionsKey =
        searchType === 'mentions'
          ? 'autocompleteSuggestions'
          : 'hashtagAutocompleteSuggestions';

      // Only query for suggestions after users enter 2 or more characters
      if (!value || value.length < 2) {
        this.setState({
          [searchQueryKey]: value,
          [suggestionsKey]: [],
        });
        return;
      }

      // Don't run the Facebook Autocomplete if there isn't at least one Facebook page selected
      if (
        this.props.draft.service.name === 'facebook' &&
        searchType === 'mentions'
      ) {
        const hasSelectedFbPages = this.props.profiles.some(
          p =>
            p.isSelected &&
            p.service.name === 'facebook' &&
            p.serviceType === 'page'
        );

        if (!hasSelectedFbPages) {
          this.setState({
            [searchQueryKey]: value,
            [suggestionsKey]: [],
          });
          return;
        }
      }

      this.setState({ [searchQueryKey]: value });

      currentValue = value;

      const suggestionsStream = WebAPIUtils.getAutocompleteSuggestions(
        this.props.draft.service.name,
        value,
        searchType
      );

      (async () => {
        for await (const suggestions of suggestionsStream) {
          const doSuggestionsStillMatchSearch = value === currentValue;

          if (doSuggestionsStillMatchSearch) {
            this.setState({
              [suggestionsKey]: [...suggestions.values()],
            });
          }
        }
      })().catch(error => {
        const alreadyHasSameAutocompleteNotif = this.props.visibleNotifications.some(
          notif =>
            notif.scope === NotificationScopes.AUTOCOMPLETE &&
            notif.message === error.message
        );

        if (!alreadyHasSameAutocompleteNotif) {
          NotificationActionCreators.queueError({
            scope: NotificationScopes.AUTOCOMPLETE,
            message: error.message,
          });
        }
      });
    };
  })();

  onHashtagAutocompleteSearchChange = (...args) =>
    this.onAutocompleteSearchChange(...args, 'hashtags');

  onAutocompleteOpen = () => {
    this.isAutocompleteOpen = true;
  };

  onEmojiSuggestionsOpen = () => {
    this.isEmojiSuggestionsOpen = true;
  };

  onHashtagAutocompleteOpen = () => {
    this.isHashtagAutocompleteOpen = true;
  };

  onAutocompleteClose = () => {
    this.isAutocompleteOpen = false;

    // A small issue with draft-js-mention-plugin@2.0.0-beta10 makes resetting the
    // list of suggestions necessary upon closing. TODO: Remove when fixed.
    // See https://github.com/draft-js-plugins/draft-js-plugins/issues/687
    this.setState({
      autocompleteSuggestions: Immutable.fromJS([]),
    });
  };

  onEmojiSuggestionsClose = () => {
    this.isEmojiSuggestionsOpen = false;
  };

  onHashtagAutocompleteClose = () => {
    this.isHashtagAutocompleteOpen = false;

    // A small issue with draft-js-mention-plugin@2.0.0-beta10 makes resetting the
    // list of suggestions necessary upon closing. TODO: Remove when fixed.
    // See https://github.com/draft-js-plugins/draft-js-plugins/issues/687
    this.setState({
      hashtagAutocompleteSuggestions: Immutable.fromJS([]),
    });
  };

  onLinkUnshortened = unshortenedLink => {
    ComposerActionCreators.draftTextLinkUnshortened(
      this.props.draft.id,
      unshortenedLink
    );
  };

  onLinkShortened = (unshortenedLink, shortLink) => {
    ComposerActionCreators.draftTextLinkShortened(
      this.props.draft.id,
      unshortenedLink,
      shortLink
    );
  };

  onLinkReshortened = (unshortenedLink, shortLink) => {
    ComposerActionCreators.draftTextLinkReshortened(
      this.props.draft.id,
      unshortenedLink,
      shortLink
    );
  };

  getAutocompleteSuggestionsNotice = () => {
    // Only show notices after users enter 2 or more characters
    if (this.state.autocompleteSearchQuery.length < 2) return '';

    // Display notices for Facebook Autocomplete's special cases
    if (this.props.draft.service.name === 'facebook') {
      const selectedFbAccounts = this.props.profiles.filter(
        p => p.isSelected && p.service.name === 'facebook'
      );

      const hasSelectedFbProfiles = selectedFbAccounts.some(
        p => p.serviceType === 'profile'
      );
      const hasSelectedFbPages = selectedFbAccounts.some(
        p => p.serviceType === 'page'
      );

      if (hasSelectedFbProfiles && hasSelectedFbPages) {
        return `Only Facebook pages can add tags:
                Facebook profiles will see regular text instead.`;
      }
      if (hasSelectedFbProfiles && !hasSelectedFbPages) {
        // This was broken after updating draft-js-mention-plugin to latest: disabled
        // in the meantime to prevent uwnanted visual artifacts
        // TODO: rebuild that functionality another way now that the plugin behaves differently
        /* return `Sorry, we can’t add tags on posts from Facebook profiles (just pages).
                Your tag will show up as regular text.`; */
      }
    }

    return '';
  };

  handleReturn = e => {
    // Give control to mention plugin if it's active (to select the suggestion)
    if (this.isAutocompleteOpen || this.isHashtagAutocompleteOpen) {
      return 'not-handled';
    }

    // Give control to emoji plugin if it's active (to select the suggested emojis)
    if (this.isEmojiSuggestionsOpen) {
      return 'not-handled';
    }

    // Save drafts ("Share Now") on Ctrl/Cmd + Shift + Enter
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      AppActionCreators.saveDrafts(QueueingTypes.NOW, {
        shouldSkipEmptyTextAlert: false,
      });
      this.refs.textZone.blur();
      return 'handled';
    }

    // Save drafts ("Add to Queue") on Ctrl/Cmd + Enter
    if (e.ctrlKey || e.metaKey) {
      AppActionCreators.saveDrafts(undefined, {
        shouldSkipEmptyTextAlert: false,
      });
      this.refs.textZone.blur();
      return 'handled';
    }

    // Else if we're going to insert a new line, make it a soft one. We need soft
    // new lines for the highlighter plugin to work. Without them, due to the way
    // draft-js works, applying the highlighter decorator (which needs access to
    // an accurate character count) on a just-modified paragraph doesn't work as
    // expected if multiple paragraphs are at play, because a decorator strategy
    // only has access to an up-to-date version of the content block being edited;
    // the wider content state (that contains the other content blocks) isn't
    // updated until later. Moreover, when a change happens, decorator strategies
    // are only re-applied to the block that changed, not others. With soft new lines,
    // we only ever deal with a single content block, which means we always have access
    // to an accurate character count, and the decorator is re-applied consistently.
    // If hard new lines were used, multiple content blocks would be involved, and
    // we'd need to force full re-renders on each key stroke for the two reasons
    // mentioned above, which leads to all sorts of side-effects with EditorState.
    // tl;dr: soft new lines ftw!
    try {
      this.onEditorStateChange(
        RichUtils.insertSoftNewline(this.props.draft.editorState)
      );
    } catch (error) {
      // ERROR: we are catching this as when you hit return while having a text selection
      // selected, we can't replace the text with the return characters. So we need to
      // handle this to prevent errors getting to users
    }
    return 'handled';
  };

  replacePastedText = (text, editorState) => {
    if (text) {
      return Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        text
      );
    }

    return null;
  };

  updateEditorStateAfterPaste = (editorState, contentState) => {
    this.onEditorStateChange(
      EditorState.push(editorState, contentState, 'insert-fragment')
    );
  };

  handlePastedText = text => {
    const { editorState } = this.props.draft;
    const contentState = this.replacePastedText(text, editorState);

    if (contentState) {
      this.updateEditorStateAfterPaste(editorState, contentState);
    }

    return 'handled';
  };

  /**
   * Move a selection state in one direction or another.
   * See: https://draftjs.org/docs/api-reference-selection-state
   */
  moveSelection = (selection, move) => {
    return new SelectionState({
      anchorKey: selection.getAnchorKey(),
      anchorOffset: selection.getAnchorOffset() + move,
      focusKey: selection.getFocusKey(),
      focusOffset: selection.getFocusOffset() + move,
    });
  };

  /**
   * Handle input before it's processed by draft-js or rendered in React.
   * See: https://draftjs.org/docs/api-reference-editor#handlebeforeinput
   */
  handleBeforeInput = (chars, editorState) => {
    /**
     * On macOS pressing spacebar twice quickly adds a period and a space —
     * if left 'undhandled' this change in the input can cause draft-js to crash.
     * (One example is when this is done immediately after you type a link since
     * that triggers shortening to happen and draft-js / React gets confused
     * when trying to mutate the DOM since the sudden '.' is unexpected.)
     *
     * To solve this we look for when this 'double' character has been entered
     * and manually add it to the editorState ourselves - thus preventing the
     * unfortunate crashing.
     */
    const PERIOD_AND_SPACE = '. ';
    const PERIOD = '.';
    if (chars === PERIOD_AND_SPACE) {
      // Create a new content state that inserts the period
      const currentSelection = editorState.getSelection();
      // Move the selection (cursor) back one to account for the double characters
      const insertAt = this.moveSelection(currentSelection, -1);
      const contentState = Modifier.insertText(
        editorState.getCurrentContent(),
        insertAt,
        PERIOD,
        editorState.getCurrentInlineStyle(),
        null
      );
      // Create a new editor state with the period added
      let newEditorState = EditorState.push(
        editorState,
        contentState,
        'insert-fragment'
      );
      // Create a new editor state with the cursor at the right spot
      // (Without this Safari on macOS moves the cursor back to the beginning of the text!)
      newEditorState = EditorState.forceSelection(
        newEditorState,
        this.moveSelection(currentSelection, 1)
      );

      // Send the new state up the chain
      this.onEditorStateChange(newEditorState);

      // Tell draft-js we've taken care of this one
      return 'handled';
    }
    return 'not-handled';
  };

  parseDraftTextLinks = () =>
    setImmediate(() => {
      ComposerActionCreators.parseDraftTextLinks(this.props.draft.id);
    });

  createEditorPlugins = () => {
    const editorPlugins = [];
    const editorPluginsComponents = {};
    const editorPluginsUtils = {};

    // Create short link plugin
    const shortLinkPlugin = createShortLinkPlugin();
    editorPlugins.push(shortLinkPlugin);
    editorPluginsComponents.ShortLinkTooltip = shortLinkPlugin.ShortLinkTooltip;

    // Create unshortened link plugin
    const unshortenedLinkPlugin = createUnshortenedLinkPlugin();
    editorPlugins.push(unshortenedLinkPlugin);
    editorPluginsComponents.UnshortenedLinkTooltip =
      unshortenedLinkPlugin.UnshortenedLinkTooltip;

    // Create link plugin to decorate non-entity links
    const linkPlugin = createLinkDecoratorPlugin();
    editorPlugins.push(linkPlugin);

    // Create inspect-selection plugin to hook a util function into the editor
    const inspectSelectionPlugin = createInspectSelectionPlugin();
    editorPlugins.push(inspectSelectionPlugin);
    editorPluginsUtils.getCharacterBeforeSelectionStart =
      inspectSelectionPlugin.getCharacterBeforeSelectionStart;

    // Create highlighter plugin
    if (this.props.draft.service.charLimit !== null) {
      const highlighterPlugin = createHighlighterPlugin(
        this.props.draft,
        getDraftCharacterCount
      );
      editorPlugins.push(highlighterPlugin);
    }

    // Create Twitter autocomplete plugin that only handles prepopulated mentions
    if (this.props.draft.service.name === 'twitter') {
      const prepopulatedMentionPlugin = createPrepopulatedMentionPlugin();
      editorPlugins.push(prepopulatedMentionPlugin);
    }

    // Create Twitter autocomplete plugin that only handles prepopulated hashtags
    if (this.shouldEnableHashtagAutocomplete()) {
      const prepopulatedHashtagPlugin = createPrepopulatedHashtagPlugin();
      editorPlugins.push(prepopulatedHashtagPlugin);
    }

    // Create Facebook autocomplete plugin that only handles imported mentions
    if (this.props.draft.service.name === 'facebook') {
      const importedFacebookMentionPlugin = createImportedFacebookMentionPlugin();
      editorPlugins.push(importedFacebookMentionPlugin);
    }

    // Create autocomplete plugin that handles mentions typed by users
    if (this.shouldEnableAutocomplete()) {
      const getDecoratorParentRect = () =>
        this.refs.editorWrapper.getBoundingClientRect();
      const autocompletePlugin = createMentionPlugin({
        theme:
          this.props.draft.service.name === 'twitter'
            ? twitterAutocompleteStyles
            : this.props.draft.service.name === 'facebook'
            ? facebookAutocompleteStyles
            : null,
        positionSuggestions: getAutocompleteSuggestionsPosition.bind(
          null,
          getDecoratorParentRect
        ),
        entityMutability: 'IMMUTABLE',
      });

      editorPlugins.push(autocompletePlugin);
      editorPluginsComponents.AutocompleteSuggestions =
        autocompletePlugin.MentionSuggestions;
      editorPluginsComponents.AutocompleteSuggestionsEntry =
        this.props.draft.service.name === 'twitter'
          ? TwitterAutocompleteSuggestionsEntry
          : this.props.draft.service.name === 'facebook'
          ? FacebookAutocompleteSuggestionsEntry
          : null;

      this.isAutocompleteOpen = false;
    }

    // Create autocomplete plugin that handles hashtags typed by users
    if (this.shouldEnableHashtagAutocomplete()) {
      const getDecoratorParentRect = () =>
        this.refs.editorWrapper.getBoundingClientRect();
      const hashtagAutocompletePlugin = createMentionPlugin({
        theme: twitterHashtagAutocompleteStyles,
        positionSuggestions: getAutocompleteSuggestionsPosition.bind(
          null,
          getDecoratorParentRect
        ),
        entityMutability: 'IMMUTABLE',
        mentionTrigger: '#',
      });

      editorPlugins.push(hashtagAutocompletePlugin);
      editorPluginsComponents.HashtagAutocompleteSuggestions =
        hashtagAutocompletePlugin.MentionSuggestions;
      editorPluginsComponents.HashtagAutocompleteSuggestionsEntry = TwitterHashtagAutocompleteSuggestionsEntry;

      this.isHashtagAutocompleteOpen = false;
    }

    // Create Twitter mention plugin to decorate non-entity mentions
    if (this.props.draft.service.name === 'twitter') {
      const mentionPlugin = createMentionDecoratorPlugin();
      editorPlugins.push(mentionPlugin);
    }

    // Create Twitter hashtag plugin to decorate non-entity hashtags
    if (this.shouldEnableHashtagAutocomplete()) {
      const hashtagPlugin = createHashtagDecoratorPlugin();
      editorPlugins.push(hashtagPlugin);
    }

    // Create Emoji plugin
    const emojiImageStyle = {
      width: '1em',
      height: '1em',
    };

    const emojiPlugin = createEmojiPlugin({
      useNativeArt: true,
      selectButtonContent: (
        <svg
          aria-label="click to add emoji"
          fill="currentColor"
          style={emojiImageStyle}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 40 40"
        >
          <path d="m28.3 24q-0.8 2.7-3.1 4.3t-5.1 1.7-5-1.6-3.1-4.4q-0.2-0.6 0.1-1.1t0.8-0.7q0.6-0.2 1.1 0.1t0.7 0.8q0.6 1.8 2.1 2.9t3.3 1.1 3.4-1.1 2.1-2.9q0.2-0.5 0.7-0.8t1.1-0.1 0.8 0.7 0.1 1.1z m-11-9.7q0 1.2-0.9 2t-2 0.8-2-0.8-0.8-2 0.8-2 2-0.9 2 0.9 0.9 2z m11.4 0q0 1.2-0.8 2t-2 0.8-2.1-0.8-0.8-2 0.8-2 2.1-0.9 2 0.9 0.8 2z m5.7 5.7q0-2.9-1.1-5.5t-3.1-4.6-4.5-3.1-5.6-1.1-5.5 1.1-4.6 3.1-3 4.6-1.1 5.5 1.1 5.5 3 4.6 4.6 3 5.5 1.2 5.6-1.2 4.5-3 3.1-4.6 1.1-5.5z m2.9 0q0 4.7-2.3 8.6t-6.3 6.2-8.6 2.3-8.6-2.3-6.2-6.2-2.3-8.6 2.3-8.6 6.2-6.2 8.6-2.3 8.6 2.3 6.3 6.2 2.3 8.6z" />
        </svg>
      ),
    });
    editorPlugins.push(emojiPlugin);
    editorPluginsComponents.EmojiSuggestions = emojiPlugin.EmojiSuggestions;
    editorPluginsComponents.EmojiSelect = emojiPlugin.EmojiSelect;

    return { editorPlugins, editorPluginsComponents, editorPluginsUtils };
  };

  shouldEnableAutocomplete = () =>
    this.props.draft.service.name === 'twitter' ||
    (this.props.draft.service.name === 'facebook' &&
      this.props.shouldEnableFacebookAutocomplete);

  shouldEnableHashtagAutocomplete = () =>
    this.props.draft.service.name === 'twitter';

  render() {
    const {
      draft,
      isComposerExpanded,
      placeholder,
      usesImageFirstLayout,
      attachmentGlanceHasNoThumbnail,
      readOnly,
    } = this.props;

    const {
      ShortLinkTooltip,
      UnshortenedLinkTooltip,
      AutocompleteSuggestions,
      AutocompleteSuggestionsEntry,
      HashtagAutocompleteSuggestions,
      HashtagAutocompleteSuggestionsEntry,
      EmojiSuggestions,
      EmojiSelect,
    } = this.editorPluginsComponents;

    const textZoneClassName = [
      this.props.hasLinkAttachment && isComposerExpanded
        ? [styles.expandedTextZone, styles.hasLinkAttachment].join(' ')
        : isComposerExpanded
        ? styles.expandedTextZone
        : attachmentGlanceHasNoThumbnail
        ? [
            styles.hasAttachmentGlanceNoThumbnail,
            styles.collapsedTextZone,
          ].join(' ')
        : this.props.hasAttachmentGlance
        ? [styles.hasAttachmentGlance, styles.collapsedTextZone].join(' ')
        : styles.collapsedTextZone,
    ].join(' ');

    const textZoneTooltipClassNames = {
      visible: styles.visibleTextZoneTooltip,
      hidden: styles.hiddenTextZoneTooltip,
    };

    const editorWrapperClassName = usesImageFirstLayout
      ? styles.imageFirstEditorWrapper
      : styles.editorWrapper;

    const emojiButtonStyle = {
      position: 'absolute',
      right: '10px',
      top: '10px',
    };

    return (
      <div className={editorWrapperClassName} ref="editorWrapper">
        <div
          className={textZoneClassName}
          onKeyDown={this.onKeyDown}
          onPaste={this.onPaste}
          onCut={this.onCut}
          onDrop={this.onDrop}
          onClick={this.onClick}
          onFocus={this.onFocus}
          data-cy="composer-text-zone"
        >
          <DraftjsEditor
            editorState={draft.editorState}
            onChange={this.onEditorStateChange}
            placeholder={placeholder}
            plugins={this.editorPlugins}
            CompositeDraftDecorator={CompositeNestableDecorator}
            spellCheck
            readOnly={readOnly}
            handleReturn={this.handleReturn}
            handlePastedText={this.handlePastedText}
            handleBeforeInput={this.handleBeforeInput}
            ref="textZone"
          />
          <EmojiSuggestions
            onOpen={this.onEmojiSuggestionsOpen}
            onClose={this.onEmojiSuggestionsClose}
          />
          <div style={emojiButtonStyle}>
            {isComposerExpanded && <EmojiSelect />}
          </div>
        </div>

        {isComposerExpanded && this.shouldEnableAutocomplete() && (
          <AutocompleteSuggestions
            onSearchChange={this.onAutocompleteSearchChange}
            onOpen={this.onAutocompleteOpen}
            onClose={this.onAutocompleteClose}
            suggestions={this.state.autocompleteSuggestions}
            entryComponent={AutocompleteSuggestionsEntry}
            data-notice={this.getAutocompleteSuggestionsNotice()}
            data-suggestions-count={this.state.autocompleteSuggestions.size}
          />
        )}

        {isComposerExpanded && this.shouldEnableHashtagAutocomplete() && (
          <HashtagAutocompleteSuggestions
            onSearchChange={this.onHashtagAutocompleteSearchChange}
            onOpen={this.onHashtagAutocompleteOpen}
            onClose={this.onHashtagAutocompleteClose}
            suggestions={this.state.hashtagAutocompleteSuggestions}
            entryComponent={HashtagAutocompleteSuggestionsEntry}
          />
        )}

        {isComposerExpanded && (
          <ShortLinkTooltip
            classNames={textZoneTooltipClassNames}
            onLinkUnshortened={this.onLinkUnshortened}
          />
        )}
        {isComposerExpanded && (
          <UnshortenedLinkTooltip
            classNames={textZoneTooltipClassNames}
            onLinkReshortened={this.onLinkReshortened}
          />
        )}
      </div>
    );
  }
}

export default Editor;

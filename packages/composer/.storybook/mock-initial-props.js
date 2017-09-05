// TODO: Make this file helpful for documentation purposes by pulling out verbose and
// repetitive data such as profiles, and beautifying its contents with plain objects
// instead of parsing serialized data

const useCases = {
  create: JSON.parse('{"csrfToken":"6ddefd726355fd4160b41148adde7d28","imageDimensionsKey":"e916e8dc591cfa0986eeb7951420784d","metaData":{"environment":"local","appEnvironment":"WEB_DASHBOARD","shouldDisplayHelpButton":false,"shouldEnableFacebookAutocomplete":true,"shouldUseNewTwitterAutocomplete":true,"showTwitterImageDescription":true,"text":null,"url":null,"sourceUrl":null,"linkData":null,"via":null,"images":null,"video":null,"browser":null,"composerInitiator":null,"extensionVersion":null,"retweetData":null,"updateId":null,"scheduledAt":null,"isPinnedToSlot":null,"didUserSetScheduledAt":null,"facebookMentionEntities":null},"options":{"canSelectProfiles":true,"saveButtons":["ADD_TO_QUEUE","SHARE_NEXT","SHARE_NOW","SCHEDULE_POST"],"position":{"top":10,"left":10}},"profilesData":[{"id":"55a8c61af1be7c332e674523","serviceName":"google","serviceUsername":"Markdown","serviceFormattedUsername":"Markdown","imagesAvatar":"https://lh4.googleusercontent.com/-rZrfmZWVl-Q/AAAAAAAAAAI/AAAAAAAAAFM/LNk6Vpk7cpM/photo.jpg?sz=50","timezone":"Europe/Paris","shouldBeAutoSelected":false,"isDisabled":false,"serviceType":"page","isBusinessProfile":true,"subprofiles":[]}],"userData":{"id":"4f26d903512f7e4261000004","s3UploadSignature":{"algorithm":"AWS4-HMAC-SHA256","base64Policy":"eyJleHBpcmF0aW9uIjoiMjAxNy0wOC0yNVQwOjQzOjAxWiIsImNvbmRpdGlvbnMiOlt7ImJ1Y2tldCI6ImJ1ZmZlci1tZWRpYS11cGxvYWRzIn0seyJhY2wiOiJwdWJsaWMtcmVhZCJ9LFsic3RhcnRzLXdpdGgiLCIka2V5IiwiIl0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCIiXSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFJS1pONktSWjdQVElGTjJBXC8yMDE3MDgyNFwvdXMtZWFzdC0xXC9zM1wvYXdzNF9yZXF1ZXN0In0seyJ4LWFtei1hbGdvcml0aG0iOiJBV1M0LUhNQUMtU0hBMjU2In0seyJ4LWFtei1kYXRlIjoiMjAxNzA4MjRUMTg0MzAxWiJ9LHsieC1hbXotZXhwaXJlcyI6Ijg2NDAwIn1dfQ==","bucket":"buffer-media-uploads","credentials":"AKIAIKZN6KRZ7PTIFN2A/20170824/us-east-1/s3/aws4_request","date":"20170824T184301Z","expires":"86400","signature":"f34365ad6a41c645cc4a2632099a271f506686580cd419ad5eb1bd71b16ab7ef","successActionStatus":"201"},"uses24hTime":false,"weekStartsMonday":false,"isFreeUser":false,"isBusinessUser":true,"shouldAlwaysSkipEmptyTextAlert":true,"profileGroups":[{"name":"Group w/ Pinterest","id":"577d1354f97024eb448b4569","profileIds":["561d1176f0dd61256e4a3be1","57484da313f0a3da722fed0b","55a8c5bd59a31eee1d28a730"]}],"profilesSchedulesSlots":{"563130de49318ffb41ee2f22":{"2017-08-24":[{"timestamp":1503565920,"isSlotFree":true},{"timestamp":1503576300,"isSlotFree":true},{"timestamp":1503595140,"isSlotFree":true},{"timestamp":1503605520,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503652320,"isSlotFree":true},{"timestamp":1503662700,"isSlotFree":true},{"timestamp":1503681540,"isSlotFree":true},{"timestamp":1503691920,"isSlotFree":true}]},"56dd47724c7d55a6551e85ef":{"2017-08-24":[{"timestamp":1503568260,"isSlotFree":true},{"timestamp":1503595800,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503654660,"isSlotFree":true},{"timestamp":1503682200,"isSlotFree":true}]},"5866535b45b311166c2cc582":{"2017-08-24":[{"timestamp":1503556200,"isSlotFree":true},{"timestamp":1503586080,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503642600,"isSlotFree":true},{"timestamp":1503672480,"isSlotFree":true}]},"588a38c6c616f0f82676f933":{"2017-08-24":[{"timestamp":1503605460,"isSlotFree":true},{"timestamp":1503634440,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503691860,"isSlotFree":true},{"timestamp":1503720840,"isSlotFree":true}]},"58cc411a8b7d552552dfe137":{"2017-08-24":[{"timestamp":1503604680,"isSlotFree":true},{"timestamp":1503616800,"isSlotFree":true},{"timestamp":1503632880,"isSlotFree":true},{"timestamp":1503644580,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503691080,"isSlotFree":true},{"timestamp":1503703200,"isSlotFree":true},{"timestamp":1503719280,"isSlotFree":true},{"timestamp":1503730980,"isSlotFree":true}]},"4f26d91b512f7eb760000004":{"2017-08-24":[{"timestamp":1503576720,"isSlotFree":true},{"timestamp":1503586320,"isSlotFree":true},{"timestamp":1503591000,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503663120,"isSlotFree":true},{"timestamp":1503672720,"isSlotFree":true},{"timestamp":1503677400,"isSlotFree":true}]},"56c1a013a85b423f618b4571":{"2017-08-24":[{"timestamp":1503597360,"isSlotFree":true},{"timestamp":1503617100,"isSlotFree":true},{"timestamp":1503628740,"isSlotFree":true},{"timestamp":1503649080,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503683760,"isSlotFree":true},{"timestamp":1503703500,"isSlotFree":true},{"timestamp":1503715140,"isSlotFree":true},{"timestamp":1503735480,"isSlotFree":true}]},"55a8c5bd59a31eee1d28a730":{"2017-08-24":[{"timestamp":1503568200,"isSlotFree":true},{"timestamp":1503568200,"isSlotFree":true},{"timestamp":1503568260,"isSlotFree":true},{"timestamp":1503568680,"isSlotFree":true},{"timestamp":1503568740,"isSlotFree":true},{"timestamp":1503568740,"isSlotFree":true},{"timestamp":1503568920,"isSlotFree":true},{"timestamp":1503569040,"isSlotFree":true},{"timestamp":1503569100,"isSlotFree":true},{"timestamp":1503569100,"isSlotFree":true},{"timestamp":1503569220,"isSlotFree":true},{"timestamp":1503569280,"isSlotFree":true},{"timestamp":1503569280,"isSlotFree":true},{"timestamp":1503569340,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503654600,"isSlotFree":true},{"timestamp":1503654600,"isSlotFree":true},{"timestamp":1503654660,"isSlotFree":true},{"timestamp":1503655080,"isSlotFree":true},{"timestamp":1503655140,"isSlotFree":true},{"timestamp":1503655140,"isSlotFree":true},{"timestamp":1503655320,"isSlotFree":true},{"timestamp":1503655440,"isSlotFree":true},{"timestamp":1503655500,"isSlotFree":true},{"timestamp":1503655500,"isSlotFree":true},{"timestamp":1503655620,"isSlotFree":true},{"timestamp":1503655680,"isSlotFree":true},{"timestamp":1503655680,"isSlotFree":true},{"timestamp":1503655740,"isSlotFree":true}]},"561d1176f0dd61256e4a3be1":{"2017-08-24":[{"timestamp":1503537180,"isSlotFree":true},{"timestamp":1503553800,"isSlotFree":true},{"timestamp":1503560100,"isSlotFree":true},{"timestamp":1503576060,"isSlotFree":true},{"timestamp":1503604020,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503623580,"isSlotFree":true},{"timestamp":1503640200,"isSlotFree":true},{"timestamp":1503646500,"isSlotFree":true},{"timestamp":1503662460,"isSlotFree":true},{"timestamp":1503690420,"isSlotFree":true}]},"57484da313f0a3da722fed0b":{"2017-08-24":[{"timestamp":1503581700,"isSlotFree":true},{"timestamp":1503592920,"isSlotFree":true},{"timestamp":1503610920,"isSlotFree":true},{"timestamp":1503623940,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503668100,"isSlotFree":true},{"timestamp":1503679320,"isSlotFree":true},{"timestamp":1503697320,"isSlotFree":true},{"timestamp":1503710340,"isSlotFree":true}]},"574ea26ec98c42c47d68d135":{"2017-08-24":[{"timestamp":1503582840,"isSlotFree":true},{"timestamp":1503594360,"isSlotFree":true},{"timestamp":1503611460,"isSlotFree":true},{"timestamp":1503623100,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503669240,"isSlotFree":true},{"timestamp":1503680760,"isSlotFree":true},{"timestamp":1503697860,"isSlotFree":true},{"timestamp":1503709500,"isSlotFree":true}]},"562515bc4c48120b6406ddb0":{"2017-08-24":[{"timestamp":1503564840,"isSlotFree":true},{"timestamp":1503572580,"isSlotFree":true},{"timestamp":1503589500,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503651240,"isSlotFree":true},{"timestamp":1503658980,"isSlotFree":true},{"timestamp":1503675900,"isSlotFree":true}]},"55a8c61af1be7c332e674523":{"2017-08-24":[{"timestamp":1503563100,"isSlotFree":true},{"timestamp":1503587700,"isSlotFree":true}],"2017-08-25":[{"timestamp":1503649500,"isSlotFree":true},{"timestamp":1503674100,"isSlotFree":true}]}}}}'),

  edit: JSON.parse('{"csrfToken":"4c644565d4c4cbefb9626977d003878a","imageDimensionsKey":"e916e8dc591cfa0986eeb7951420784d","metaData":{"environment":"production","appEnvironment":"WEB_DASHBOARD","shouldDisplayHelpButton":false,"shouldEnableFacebookAutocomplete":true,"shouldUseNewTwitterAutocomplete":true,"showTwitterImageDescription":true,"text":"Hello! 😃","url":null,"sourceUrl":null,"linkData":null,"via":null,"images":["https://buffer-pictures.s3.amazonaws.com/16b1aa7e6a4bee60ac70129018687878.37b22cbdcd71940bca8719bf78d48484.jpg"],"video":null,"browser":null,"composerInitiator":null,"extensionVersion":null,"retweetData":null,"updateId":"571005b637d70c854391b34a","scheduledAt":1461254400,"isPinnedToSlot":false,"didUserSetScheduledAt":true,"facebookMentionEntities":null},"options":{"canSelectProfiles":false,"saveButtons":["SAVE"],"position":{"top":40}},"profilesData":[{"id":"56dd47724c7d55a6551e85ef","serviceName":"linkedin","serviceUsername":"Joe Dohn","serviceFormattedUsername":"Joe Dohn","imagesAvatar":"/dashboard/safeimage?width=40&height=40&url=http%3A%2F%2Fs3.licdn.com%2Fscds%2Fcommon%2Fu%2Fimg%2Ficon%2Ficon_no_photo_no_border_60x60.png&hash=b4560a412e87b59fcaaea0b99cdcd5f3","timezone":"Europe/London","shouldBeAutoSelected":true,"isDisabled":false,"serviceType":"profile","isBusinessProfile":true,"subprofiles":[]}],"userData":{"id":"4f26d903512f7e4261000004","s3UploadSignature":{"algorithm":"AWS4-HMAC-SHA256","base64Policy":"eyJleHBpcmF0aW9uIjoiMjAxNy0wOC0zMFQxODo0ODoxOFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJidWZmZXItbWVkaWEtdXBsb2FkcyJ9LHsiYWNsIjoicHVibGljLXJlYWQifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsIiJdLFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwiIl0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDEifSx7IngtYW16LWNyZWRlbnRpYWwiOiJBS0lBSUtaTjZLUlo3UFRJRk4yQVwvMjAxNzA4MzBcL3VzLWVhc3QtMVwvczNcL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMTcwODMwVDEyNDgxOFoifSx7IngtYW16LWV4cGlyZXMiOiI4NjQwMCJ9XX0=","bucket":"buffer-media-uploads","credentials":"AKIAIKZN6KRZ7PTIFN2A/20170830/us-east-1/s3/aws4_request","date":"20170830T124818Z","expires":"86400","signature":"22f728a06dc62b94a51e965fd82adf6f29f8eca0a0c469635520abe339ad89b0","successActionStatus":"201"},"uses24hTime":false,"weekStartsMonday":false,"isFreeUser":false,"isBusinessUser":true,"shouldAlwaysSkipEmptyTextAlert":true,"profileGroups":[{"name":"Group w/ Pinterest","id":"577d1354f97024eb448b4569","profileIds":["561d1176f0dd61256e4a3be1","57484da313f0a3da722fed0b","55a8c5bd59a31eee1d28a730"]}],"profilesSchedulesSlots":{"563130de49318ffb41ee2f22":{"2017-08-30":[{"timestamp":1504084320,"isSlotFree":true},{"timestamp":1504094700,"isSlotFree":true},{"timestamp":1504113540,"isSlotFree":true},{"timestamp":1504123920,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504170720,"isSlotFree":true},{"timestamp":1504181100,"isSlotFree":true},{"timestamp":1504199940,"isSlotFree":true},{"timestamp":1504210320,"isSlotFree":true}]},"56dd47724c7d55a6551e85ef":{"2017-08-30":[{"timestamp":1504086660,"isSlotFree":true},{"timestamp":1504114200,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504173060,"isSlotFree":true},{"timestamp":1504200600,"isSlotFree":true}]},"5866535b45b311166c2cc582":{"2017-08-30":[{"timestamp":1504074600,"isSlotFree":true},{"timestamp":1504104480,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504161000,"isSlotFree":true},{"timestamp":1504190880,"isSlotFree":true}]},"588a38c6c616f0f82676f933":{"2017-08-30":[{"timestamp":1504123860,"isSlotFree":true},{"timestamp":1504152840,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504210260,"isSlotFree":true},{"timestamp":1504239240,"isSlotFree":true}]},"58cc411a8b7d552552dfe137":{"2017-08-30":[{"timestamp":1504123080,"isSlotFree":true},{"timestamp":1504135200,"isSlotFree":true},{"timestamp":1504151280,"isSlotFree":true},{"timestamp":1504162980,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504209480,"isSlotFree":true},{"timestamp":1504221600,"isSlotFree":true},{"timestamp":1504237680,"isSlotFree":true},{"timestamp":1504249380,"isSlotFree":true}]},"4f26d91b512f7eb760000004":{"2017-08-30":[{"timestamp":1504095120,"isSlotFree":true},{"timestamp":1504109400,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504181520,"isSlotFree":true},{"timestamp":1504191120,"isSlotFree":true},{"timestamp":1504195800,"isSlotFree":true}]},"56c1a013a85b423f618b4571":{"2017-08-30":[{"timestamp":1504115760,"isSlotFree":true},{"timestamp":1504135500,"isSlotFree":true},{"timestamp":1504147140,"isSlotFree":true},{"timestamp":1504167480,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504202160,"isSlotFree":true},{"timestamp":1504221900,"isSlotFree":true},{"timestamp":1504233540,"isSlotFree":true},{"timestamp":1504253880,"isSlotFree":true}]},"55a8c5bd59a31eee1d28a730":{"2017-08-30":[{"timestamp":1504086600,"isSlotFree":true},{"timestamp":1504086600,"isSlotFree":true},{"timestamp":1504086660,"isSlotFree":true},{"timestamp":1504087080,"isSlotFree":true},{"timestamp":1504087140,"isSlotFree":true},{"timestamp":1504087140,"isSlotFree":true},{"timestamp":1504087320,"isSlotFree":true},{"timestamp":1504087440,"isSlotFree":true},{"timestamp":1504087500,"isSlotFree":true},{"timestamp":1504087500,"isSlotFree":true},{"timestamp":1504087620,"isSlotFree":true},{"timestamp":1504087680,"isSlotFree":true},{"timestamp":1504087680,"isSlotFree":true},{"timestamp":1504087740,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504173000,"isSlotFree":true},{"timestamp":1504173000,"isSlotFree":true},{"timestamp":1504173060,"isSlotFree":true},{"timestamp":1504173480,"isSlotFree":true},{"timestamp":1504173540,"isSlotFree":true},{"timestamp":1504173540,"isSlotFree":true},{"timestamp":1504173720,"isSlotFree":true},{"timestamp":1504173840,"isSlotFree":true},{"timestamp":1504173900,"isSlotFree":true},{"timestamp":1504173900,"isSlotFree":true},{"timestamp":1504174020,"isSlotFree":true},{"timestamp":1504174080,"isSlotFree":true},{"timestamp":1504174080,"isSlotFree":true},{"timestamp":1504174140,"isSlotFree":true}]},"561d1176f0dd61256e4a3be1":{"2017-08-30":[{"timestamp":1504055580,"isSlotFree":true},{"timestamp":1504072200,"isSlotFree":true},{"timestamp":1504078500,"isSlotFree":true},{"timestamp":1504094460,"isSlotFree":true},{"timestamp":1504122420,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504141980,"isSlotFree":true},{"timestamp":1504158600,"isSlotFree":true},{"timestamp":1504164900,"isSlotFree":true},{"timestamp":1504180860,"isSlotFree":true},{"timestamp":1504208820,"isSlotFree":true}]},"57484da313f0a3da722fed0b":{"2017-08-30":[{"timestamp":1504100100,"isSlotFree":true},{"timestamp":1504111320,"isSlotFree":true},{"timestamp":1504129320,"isSlotFree":true},{"timestamp":1504142340,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504186500,"isSlotFree":true},{"timestamp":1504197720,"isSlotFree":true},{"timestamp":1504215720,"isSlotFree":true},{"timestamp":1504228740,"isSlotFree":true}]},"574ea26ec98c42c47d68d135":{"2017-08-30":[{"timestamp":1504101240,"isSlotFree":true},{"timestamp":1504112760,"isSlotFree":true},{"timestamp":1504129860,"isSlotFree":true},{"timestamp":1504141500,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504187640,"isSlotFree":true},{"timestamp":1504199160,"isSlotFree":true},{"timestamp":1504216260,"isSlotFree":true},{"timestamp":1504227900,"isSlotFree":true}]},"562515bc4c48120b6406ddb0":{"2017-08-30":[{"timestamp":1504083240,"isSlotFree":true},{"timestamp":1504090980,"isSlotFree":true},{"timestamp":1504107900,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504169640,"isSlotFree":true},{"timestamp":1504177380,"isSlotFree":true},{"timestamp":1504194300,"isSlotFree":true}]},"55a8c61af1be7c332e674523":{"2017-08-30":[{"timestamp":1504081500,"isSlotFree":true},{"timestamp":1504106100,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504167900,"isSlotFree":true},{"timestamp":1504192500,"isSlotFree":true}]}}}}'),

  editWithLinkAttachment: JSON.parse('{"csrfToken":"a734c82347ec3efa4e680366d50d1465","imageDimensionsKey":"e916e8dc591cfa0986eeb7951420784d","metaData":{"environment":"production","appEnvironment":"WEB_DASHBOARD","shouldDisplayHelpButton":false,"shouldEnableFacebookAutocomplete":true,"shouldUseNewTwitterAutocomplete":true,"showTwitterImageDescription":true,"text":"","url":null,"sourceUrl":null,"linkData":{"url":"https://open.buffer.com/buffer-values/?utm_content=bufferdb399&utm_medium=social&utm_source=linkedin.com&utm_campaign=buffer","title":"The 10 Buffer Values and How We Act on Them Every Day","description":"An in-depth look at each of the 10 Buffer values and how Buffer team members work on them every day.","thumbnail":"https://buffer-media-uploads.s3.amazonaws.com/58fdd6bd7f1d34641301b842/d2fbcad317e12bae138c16eebbda35acac745c75_c5610d9ba6b2d35f50400c372b05eb0045d01f6a_linkedin"},"via":null,"images":null,"video":null,"browser":null,"composerInitiator":null,"extensionVersion":null,"retweetData":null,"updateId":"58fdd6bd7f1d34641301b842","scheduledAt":1496424600,"isPinnedToSlot":false,"didUserSetScheduledAt":false,"facebookMentionEntities":null},"options":{"canSelectProfiles":false,"saveButtons":["SAVE"],"position":{"top":0}},"profilesData":[{"id":"56dd47724c7d55a6551e85ef","serviceName":"linkedin","serviceUsername":"Joe Dohn","serviceFormattedUsername":"Joe Dohn","imagesAvatar":"/dashboard/safeimage?width=40&height=40&url=http%3A%2F%2Fs3.licdn.com%2Fscds%2Fcommon%2Fu%2Fimg%2Ficon%2Ficon_no_photo_no_border_60x60.png&hash=b4560a412e87b59fcaaea0b99cdcd5f3","timezone":"Europe/London","shouldBeAutoSelected":true,"isDisabled":false,"serviceType":"profile","isBusinessProfile":true,"subprofiles":[]}],"userData":{"id":"4f26d903512f7e4261000004","s3UploadSignature":{"algorithm":"AWS4-HMAC-SHA256","base64Policy":"eyJleHBpcmF0aW9uIjoiMjAxNy0wOC0zMVQxOTo1MToxMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJidWZmZXItbWVkaWEtdXBsb2FkcyJ9LHsiYWNsIjoicHVibGljLXJlYWQifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsIiJdLFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwiIl0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDEifSx7IngtYW16LWNyZWRlbnRpYWwiOiJBS0lBSUtaTjZLUlo3UFRJRk4yQVwvMjAxNzA4MzFcL3VzLWVhc3QtMVwvczNcL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMTcwODMxVDEzNTExMFoifSx7IngtYW16LWV4cGlyZXMiOiI4NjQwMCJ9XX0=","bucket":"buffer-media-uploads","credentials":"AKIAIKZN6KRZ7PTIFN2A/20170831/us-east-1/s3/aws4_request","date":"20170831T135110Z","expires":"86400","signature":"9940fa82763dc8aeb52d488b33dc376ef81c5b0cc2342926ee3d99e8503b6d22","successActionStatus":"201"},"uses24hTime":false,"weekStartsMonday":false,"isFreeUser":false,"isBusinessUser":true,"shouldAlwaysSkipEmptyTextAlert":true,"profileGroups":[{"name":"Group w/ Pinterest","id":"577d1354f97024eb448b4569","profileIds":["561d1176f0dd61256e4a3be1","57484da313f0a3da722fed0b","55a8c5bd59a31eee1d28a730"]}],"profilesSchedulesSlots":{"563130de49318ffb41ee2f22":{"2017-08-31":[{"timestamp":1504170720,"isSlotFree":true},{"timestamp":1504181100,"isSlotFree":true},{"timestamp":1504199940,"isSlotFree":true},{"timestamp":1504210320,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504257120,"isSlotFree":true},{"timestamp":1504267500,"isSlotFree":true},{"timestamp":1504286340,"isSlotFree":true},{"timestamp":1504296720,"isSlotFree":true}]},"56dd47724c7d55a6551e85ef":{"2017-08-31":[{"timestamp":1504173060,"isSlotFree":true},{"timestamp":1504200600,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504259460,"isSlotFree":true},{"timestamp":1504287000,"isSlotFree":true}]},"5866535b45b311166c2cc582":{"2017-08-31":[{"timestamp":1504161000,"isSlotFree":true},{"timestamp":1504190880,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504247400,"isSlotFree":true},{"timestamp":1504277280,"isSlotFree":true}]},"588a38c6c616f0f82676f933":{"2017-08-31":[{"timestamp":1504210260,"isSlotFree":true},{"timestamp":1504239240,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504296660,"isSlotFree":true},{"timestamp":1504325640,"isSlotFree":true}]},"58cc411a8b7d552552dfe137":{"2017-08-31":[{"timestamp":1504209480,"isSlotFree":true},{"timestamp":1504221600,"isSlotFree":true},{"timestamp":1504237680,"isSlotFree":true},{"timestamp":1504249380,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504295880,"isSlotFree":true},{"timestamp":1504308000,"isSlotFree":true},{"timestamp":1504324080,"isSlotFree":true},{"timestamp":1504335780,"isSlotFree":true}]},"4f26d91b512f7eb760000004":{"2017-08-31":[{"timestamp":1504181520,"isSlotFree":true},{"timestamp":1504191120,"isSlotFree":true},{"timestamp":1504195800,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504267920,"isSlotFree":true},{"timestamp":1504277520,"isSlotFree":true},{"timestamp":1504282200,"isSlotFree":true}]},"56c1a013a85b423f618b4571":{"2017-08-31":[{"timestamp":1504202160,"isSlotFree":true},{"timestamp":1504221900,"isSlotFree":true},{"timestamp":1504233540,"isSlotFree":true},{"timestamp":1504253880,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504288560,"isSlotFree":true},{"timestamp":1504308300,"isSlotFree":true},{"timestamp":1504319940,"isSlotFree":true},{"timestamp":1504340280,"isSlotFree":true}]},"55a8c5bd59a31eee1d28a730":{"2017-08-31":[{"timestamp":1504173000,"isSlotFree":true},{"timestamp":1504173000,"isSlotFree":true},{"timestamp":1504173060,"isSlotFree":true},{"timestamp":1504173480,"isSlotFree":true},{"timestamp":1504173540,"isSlotFree":true},{"timestamp":1504173540,"isSlotFree":true},{"timestamp":1504173720,"isSlotFree":true},{"timestamp":1504173840,"isSlotFree":true},{"timestamp":1504173900,"isSlotFree":true},{"timestamp":1504173900,"isSlotFree":true},{"timestamp":1504174020,"isSlotFree":true},{"timestamp":1504174080,"isSlotFree":true},{"timestamp":1504174080,"isSlotFree":true},{"timestamp":1504174140,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504259400,"isSlotFree":true},{"timestamp":1504259400,"isSlotFree":true},{"timestamp":1504259460,"isSlotFree":true},{"timestamp":1504259880,"isSlotFree":true},{"timestamp":1504259940,"isSlotFree":true},{"timestamp":1504259940,"isSlotFree":true},{"timestamp":1504260120,"isSlotFree":true},{"timestamp":1504260240,"isSlotFree":true},{"timestamp":1504260300,"isSlotFree":true},{"timestamp":1504260300,"isSlotFree":true},{"timestamp":1504260420,"isSlotFree":true},{"timestamp":1504260480,"isSlotFree":true},{"timestamp":1504260480,"isSlotFree":true},{"timestamp":1504260540,"isSlotFree":true}]},"561d1176f0dd61256e4a3be1":{"2017-08-31":[{"timestamp":1504141980,"isSlotFree":true},{"timestamp":1504158600,"isSlotFree":true},{"timestamp":1504164900,"isSlotFree":true},{"timestamp":1504180860,"isSlotFree":true},{"timestamp":1504208820,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504228380,"isSlotFree":true},{"timestamp":1504245000,"isSlotFree":true},{"timestamp":1504251300,"isSlotFree":true},{"timestamp":1504267260,"isSlotFree":true},{"timestamp":1504295220,"isSlotFree":true}]},"57484da313f0a3da722fed0b":{"2017-08-31":[{"timestamp":1504186500,"isSlotFree":true},{"timestamp":1504197720,"isSlotFree":true},{"timestamp":1504215720,"isSlotFree":true},{"timestamp":1504228740,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504272900,"isSlotFree":true},{"timestamp":1504284120,"isSlotFree":true},{"timestamp":1504302120,"isSlotFree":true},{"timestamp":1504315140,"isSlotFree":true}]},"574ea26ec98c42c47d68d135":{"2017-08-31":[{"timestamp":1504187640,"isSlotFree":true},{"timestamp":1504199160,"isSlotFree":true},{"timestamp":1504216260,"isSlotFree":true},{"timestamp":1504227900,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504274040,"isSlotFree":true},{"timestamp":1504285560,"isSlotFree":true},{"timestamp":1504302660,"isSlotFree":true},{"timestamp":1504314300,"isSlotFree":true}]},"562515bc4c48120b6406ddb0":{"2017-08-31":[{"timestamp":1504169640,"isSlotFree":true},{"timestamp":1504177380,"isSlotFree":true},{"timestamp":1504194300,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504256040,"isSlotFree":true},{"timestamp":1504263780,"isSlotFree":true},{"timestamp":1504280700,"isSlotFree":true}]},"55a8c61af1be7c332e674523":{"2017-08-31":[{"timestamp":1504167900,"isSlotFree":true},{"timestamp":1504192500,"isSlotFree":true}],"2017-09-01":[{"timestamp":1504254300,"isSlotFree":true},{"timestamp":1504278900,"isSlotFree":true}]}}}}'),

  extension: JSON.parse('{"csrfToken":"4c644565d4c4cbefb9626977d003878a","imageDimensionsKey":"e916e8dc591cfa0986eeb7951420784d","metaData":{"environment":"production","appEnvironment":"EXTENSION","shouldDisplayHelpButton":true,"shouldEnableFacebookAutocomplete":true,"shouldUseNewTwitterAutocomplete":true,"showTwitterImageDescription":true,"text":null,"url":null,"sourceUrl":null,"linkData":null,"via":null,"images":null,"video":null,"browser":"chrome","composerInitiator":null,"extensionVersion":null,"retweetData":null,"updateId":null,"scheduledAt":null,"isPinnedToSlot":null,"didUserSetScheduledAt":null,"facebookMentionEntities":null},"options":{"canSelectProfiles":true,"saveButtons":["ADD_TO_QUEUE","SHARE_NEXT","SHARE_NOW","SCHEDULE_POST"]},"profilesData":[{"id":"563130de49318ffb41ee2f22","serviceName":"pinterest","serviceUsername":"cequibuzz","serviceFormattedUsername":"cequibuzz","imagesAvatar":"https://i.pinimg.com/avatars/cequibuzz_1331738379_75.jpg","timezone":"Europe/London","shouldBeAutoSelected":false,"isDisabled":false,"serviceType":"profile","isBusinessProfile":true,"subprofiles":[{"id":"563130df49318ffb41ee2f23","name":"Images et Dessins","avatar":"http://i.pinimg.com/200x150/d5/b2/21/d5b221b429f97a0c74f11ff5d40b9d1b.jpg","profileId":"563130de49318ffb41ee2f22","isShared":false,"shouldBeAutoSelected":false},{"id":"563130df49318ffb41ee2f24","name":"Vidéos","avatar":"http://i.pinimg.com/200x150/d4/ee/f7/d4eef757f5ba11ead9e44f0d102e954c.jpg","profileId":"563130de49318ffb41ee2f22","isShared":false,"shouldBeAutoSelected":false}]}],"userData":{"id":"4f26d903512f7e4261000004","s3UploadSignature":{"algorithm":"AWS4-HMAC-SHA256","base64Policy":"eyJleHBpcmF0aW9uIjoiMjAxNy0wOC0zMFQyMzowNjo0NVoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJidWZmZXItbWVkaWEtdXBsb2FkcyJ9LHsiYWNsIjoicHVibGljLXJlYWQifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsIiJdLFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwiIl0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDEifSx7IngtYW16LWNyZWRlbnRpYWwiOiJBS0lBSUtaTjZLUlo3UFRJRk4yQVwvMjAxNzA4MzBcL3VzLWVhc3QtMVwvczNcL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMTcwODMwVDE3MDY0NVoifSx7IngtYW16LWV4cGlyZXMiOiI4NjQwMCJ9XX0=","bucket":"buffer-media-uploads","credentials":"AKIAIKZN6KRZ7PTIFN2A/20170830/us-east-1/s3/aws4_request","date":"20170830T170645Z","expires":"86400","signature":"4ecdad638bcb51c43bbd7674ccb5e6ae4ca265538c7569dfa0b4a0d3ea72f148","successActionStatus":"201"},"uses24hTime":false,"weekStartsMonday":false,"isFreeUser":false,"isBusinessUser":true,"shouldAlwaysSkipEmptyTextAlert":true,"profileGroups":[{"name":"Group w/ Pinterest","id":"577d1354f97024eb448b4569","profileIds":["561d1176f0dd61256e4a3be1","57484da313f0a3da722fed0b","55a8c5bd59a31eee1d28a730"]}],"profilesSchedulesSlots":{"563130de49318ffb41ee2f22":{"2017-08-30":[{"timestamp":1504084320,"isSlotFree":true},{"timestamp":1504094700,"isSlotFree":true},{"timestamp":1504113540,"isSlotFree":true},{"timestamp":1504123920,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504170720,"isSlotFree":true},{"timestamp":1504181100,"isSlotFree":true},{"timestamp":1504199940,"isSlotFree":true},{"timestamp":1504210320,"isSlotFree":true}]},"56dd47724c7d55a6551e85ef":{"2017-08-30":[{"timestamp":1504086660,"isSlotFree":true},{"timestamp":1504114200,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504173060,"isSlotFree":true},{"timestamp":1504200600,"isSlotFree":true}]},"5866535b45b311166c2cc582":{"2017-08-30":[{"timestamp":1504074600,"isSlotFree":true},{"timestamp":1504104480,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504161000,"isSlotFree":true},{"timestamp":1504190880,"isSlotFree":true}]},"588a38c6c616f0f82676f933":{"2017-08-30":[{"timestamp":1504123860,"isSlotFree":true},{"timestamp":1504152840,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504210260,"isSlotFree":true},{"timestamp":1504239240,"isSlotFree":true}]},"58cc411a8b7d552552dfe137":{"2017-08-30":[{"timestamp":1504123080,"isSlotFree":true},{"timestamp":1504135200,"isSlotFree":true},{"timestamp":1504151280,"isSlotFree":true},{"timestamp":1504162980,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504209480,"isSlotFree":true},{"timestamp":1504221600,"isSlotFree":true},{"timestamp":1504237680,"isSlotFree":true},{"timestamp":1504249380,"isSlotFree":true}]},"4f26d91b512f7eb760000004":{"2017-08-30":[{"timestamp":1504095120,"isSlotFree":true},{"timestamp":1504109400,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504181520,"isSlotFree":true},{"timestamp":1504191120,"isSlotFree":true},{"timestamp":1504195800,"isSlotFree":true}]},"56c1a013a85b423f618b4571":{"2017-08-30":[{"timestamp":1504115760,"isSlotFree":true},{"timestamp":1504135500,"isSlotFree":true},{"timestamp":1504147140,"isSlotFree":true},{"timestamp":1504167480,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504202160,"isSlotFree":true},{"timestamp":1504221900,"isSlotFree":true},{"timestamp":1504233540,"isSlotFree":true},{"timestamp":1504253880,"isSlotFree":true}]},"55a8c5bd59a31eee1d28a730":{"2017-08-30":[{"timestamp":1504086600,"isSlotFree":true},{"timestamp":1504086600,"isSlotFree":true},{"timestamp":1504086660,"isSlotFree":true},{"timestamp":1504087080,"isSlotFree":true},{"timestamp":1504087140,"isSlotFree":true},{"timestamp":1504087140,"isSlotFree":true},{"timestamp":1504087320,"isSlotFree":true},{"timestamp":1504087440,"isSlotFree":true},{"timestamp":1504087500,"isSlotFree":true},{"timestamp":1504087500,"isSlotFree":true},{"timestamp":1504087620,"isSlotFree":true},{"timestamp":1504087680,"isSlotFree":true},{"timestamp":1504087680,"isSlotFree":true},{"timestamp":1504087740,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504173000,"isSlotFree":true},{"timestamp":1504173000,"isSlotFree":true},{"timestamp":1504173060,"isSlotFree":true},{"timestamp":1504173480,"isSlotFree":true},{"timestamp":1504173540,"isSlotFree":true},{"timestamp":1504173540,"isSlotFree":true},{"timestamp":1504173720,"isSlotFree":true},{"timestamp":1504173840,"isSlotFree":true},{"timestamp":1504173900,"isSlotFree":true},{"timestamp":1504173900,"isSlotFree":true},{"timestamp":1504174020,"isSlotFree":true},{"timestamp":1504174080,"isSlotFree":true},{"timestamp":1504174080,"isSlotFree":true},{"timestamp":1504174140,"isSlotFree":true}]},"561d1176f0dd61256e4a3be1":{"2017-08-30":[{"timestamp":1504055580,"isSlotFree":true},{"timestamp":1504072200,"isSlotFree":true},{"timestamp":1504078500,"isSlotFree":true},{"timestamp":1504094460,"isSlotFree":true},{"timestamp":1504122420,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504141980,"isSlotFree":true},{"timestamp":1504158600,"isSlotFree":true},{"timestamp":1504164900,"isSlotFree":true},{"timestamp":1504180860,"isSlotFree":true},{"timestamp":1504208820,"isSlotFree":true}]},"57484da313f0a3da722fed0b":{"2017-08-30":[{"timestamp":1504100100,"isSlotFree":true},{"timestamp":1504111320,"isSlotFree":true},{"timestamp":1504129320,"isSlotFree":true},{"timestamp":1504142340,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504186500,"isSlotFree":true},{"timestamp":1504197720,"isSlotFree":true},{"timestamp":1504215720,"isSlotFree":true},{"timestamp":1504228740,"isSlotFree":true}]},"574ea26ec98c42c47d68d135":{"2017-08-30":[{"timestamp":1504101240,"isSlotFree":true},{"timestamp":1504112760,"isSlotFree":true},{"timestamp":1504129860,"isSlotFree":true},{"timestamp":1504141500,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504187640,"isSlotFree":true},{"timestamp":1504199160,"isSlotFree":true},{"timestamp":1504216260,"isSlotFree":true},{"timestamp":1504227900,"isSlotFree":true}]},"562515bc4c48120b6406ddb0":{"2017-08-30":[{"timestamp":1504083240,"isSlotFree":true},{"timestamp":1504090980,"isSlotFree":true},{"timestamp":1504107900,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504169640,"isSlotFree":true},{"timestamp":1504177380,"isSlotFree":true},{"timestamp":1504194300,"isSlotFree":true}]},"55a8c61af1be7c332e674523":{"2017-08-30":[{"timestamp":1504081500,"isSlotFree":true},{"timestamp":1504106100,"isSlotFree":true}],"2017-08-31":[{"timestamp":1504167900,"isSlotFree":true},{"timestamp":1504192500,"isSlotFree":true}]}}}}'),
};

export default useCases;

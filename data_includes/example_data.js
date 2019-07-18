
// The sequence of items (based on their labels)
var shuffleSequence = seq("consent", "counter", "audio", "intro", "instructions", "preload", sepWith("sepPractice", "practice"), "preExp", rshuffle("picture", "filler"), "comments", "results", "debriefing");

// Show the progress bar
var showProgressBar = true;

// Don't wait the very last screen to send the results
var manualSendResults = true;

// Some default settings of the parameters
var defaults = [
    "Message",
    {
        transfer: "keypress"
    },
    "DynamicQuestion",
	{
        clickableAnswers: true    // Prevents participants from choosing an answer by clicking on it
    },
];

// Indicate where to find the ZIP files containing the images and the audio samples
var zipFiles = {pictures: "http://nadinebade.de/Audio_cut.zip",
                criticalAudio: "http://nadinebade.de/pictures_critical.zip",
                fillersAudio: "http://nadinebade.de/pictures_filler.zip"};

// Generate a picture (cf. Python script)
var getPicture = function(picture){
  return c2u.newPicture("",
                          [{id:"picture", "background-image": "url('"+picture+"')", "background-size": "100% 100%",
                                width: 400, height: 300, left: 0, top: 0}],
                        {width: 450, height: 350, margin: "auto"}
                       )
};

var items = [

    // Warn participants audio is requried, give them the opportunity to adjust their volume
    ["audio", "Message", {html: {include: "audio.html"}, transfer: "click"}],

    // Increment the counter (set in shuffleSequence when it should happen)
    ["counter", "__SetCounter__", {}],

    // Send the results to the server (set in shuffleSequence when it should happen))
    ["results", "__SendResults__", {}],

	 ["comments", "Form",  {html: {include: "ProlificFeedbackPreConfirmation.html"}}],

    ["debriefing", "Message", {html: {include: "Debriefing.html"}}],

    // Two-screen item: task-oriented instructions on the first screen, mouse instructions on the second screen
    ["instructions", "Message", {html: {include: "instructions.html"}}],

    ["consent", "Form", {html: {include: "consentForm.html"}, continueOnReturn:true} ],

["intro", "Form", {html: {include: "example_intro.html"}}],

    // This checks that the resources have been preloaded
    ["preload", "ZipPreloader", {}],

    ["sepPractice", "Separator", {normalMessage: "Sehr gut, lassen Sie uns mit einem weiteren Übungsdurchgang fortfahren. Drücken Sie eine beliebige Taste."}],

    ["preExp", "Message", {html: "<div style='text-align: center;'><p>Danke! Vergessen Sie im Folgenden nicht, "+
                                 "die Sätze und Situationen ausreichend zu erwägen,<br />"+
                                 "sodass Sie ein informierte Entscheidung treffen können.</p>"+
                                 "Drücken Sie eine beliebige Taste zum Fortfahren!</p></div>" }],

    ].concat(GetItemsFrom(data, null, {
      ItemGroup: ["item", "group"],
      Elements: [
          // Label each item with the value in 'expt'
          function(x){return x.expt;},
          // Each item generated from the table is a DynamicQuestion trial
          "DynamicQuestion",
          {
              // We store the values of these cells in the results file
              legend: function(x){ return [x.item,x.expt,x.condition,x.group,x.sentence].join("+"); },
              // Generate each picture and return them as answers
              answers: {
                // The labels are defined in global_z.css
		 Empty: ["", ""],
                 CompUnnatural: ["1", "1"],
                 Unnatural: ["2", "2"],
                 NotNatural: ["3", "3"],
                 Average: ["4", "4"],
                 Natural: ["5", "5"],
                 CompNatural: ["6", "6"],
		 Empty2: ["", ""]
                    },
             enabled: false,                             // The user won't validate the trial by clicking/pressing the key.
             sequence: function(x){
                    return [
					                      // DEBUG INFORMATION
                     // "<p style='font-size: small;'>Condition: "+x.condition+"; Item: "+x.item+"; Group: "+x.group+"</p>",
					getPicture(x.PicFilename),

                      // Wait 1sec
                      {pause: 1000},
                      // Enable clicks
                      function(t){ t.enabled = true; },
                      // Play audio file
                      {audio: x.Sound_filename, type: "audio/wav", waitFor: true, newRT: true},
		
			    {this: "answers", showKeys: "bottom", waitFor: true}
                    ];
                  }
                }

      ],
  }));

//examples

var examples = [];
examples.push({title: "The Slow Mo Guys - Underwater Bullets", preview:"img/previews/prev1.jpg", duration:"0:28", src:"video/slowmo1.mp4"});
examples.push({title: "The Slow Mo Guys - Bottle Explosion", preview:"img/previews/prev2.jpg", duration:"0:25", src:"video/slowmo2.mp4"});
examples.push({title: "The Slow Mo Guys - HUGE Building Explosion", preview:"img/previews/prev3.jpg", duration:"0:49", src:"video/slowmo3.mp4"});
examples.push({title: "r/place timelapse", preview:"img/previews/prev4.jpg", duration:"4:31", src:"video/rPlace.mp4"});
examples.push({title: "Portal 2 bouncing device", preview:"img/previews/prev5.png", duration:"0:11", src:"video/portal.mp4"});
examples.push({title: "The Slow Mo Guys - Bottle Sweep", preview:"img/previews/prev6.png", duration:"0:37", src:"video/slowmo4.mp4"});

//fill #modal1 with the examples

for (let i = 0; i < examples.length; i++) {
  $("#modal1 .modal-content").append("<div class='row'><div class='caption'><span>" + examples[i].title + "</span></div><div class='image'><img src='" + examples[i].preview + "'><div class='time'>" + examples[i].duration + "</div></div><div class='play'><span>PLAY</span><i class='fa fa-angle-double-right' aria-hidden='true'></i></div></div>");
  if (i == 0) $("#modal1 .modal-content .row").css("border", "none");
}



var cursorX;//current position of cursor

var player = document.getElementById("videoPlayer");
var acc = 10;//accuracy = frame skipping rate
var newLoc;
var firstloop = true;
var showTimePercents = false;
var videoSet = false;

var chaseMode = false;
var mode = "static";//chase mode type - "static" or "variable"
var step = .3;//chase mode speed
var chase;//chase mode interval










//jump to current cursor location on click

$("body").click(function() {
  if (!isNaN(player.duration)) {
    player.currentTime = cursorX / window.innerWidth * player.duration;
  }
});








//initiate / terminate chase mode

$("#checkbox-2").click(function() {
  chaseMode = !chaseMode;

  clearInterval(chase);
  if (chaseMode) {
    $(".chase").css("display", "flex");
    chase = setInterval(function() {

      var videoDest = cursorX / window.innerWidth * player.duration;
      $("#dest").css("left", (100 * cursorX / window.innerWidth) + "%");
      var currentTime = player.currentTime;

      var realStep = step;
      if (mode == "variable") {
        realStep = Math.abs(currentTime - videoDest) / (10 / step);
      }

      if (Math.abs(currentTime - videoDest) < (realStep / 2)) videoDest = currentTime;
      else if (currentTime > videoDest) videoDest = currentTime - realStep;
      else videoDest = currentTime + realStep;

      $("#current").css("left", (100 * currentTime / player.duration) + "%");

      if (videoDest < 0) videoDest = 0;
      if (videoDest > player.duration) videoDest = player.duration;

      var min = Math.floor(videoDest / 60);
      var sec = "";
      if (videoDest % 60 < 9.5) sec = "0";
      sec += Math.round(videoDest % 60);

      player.currentTime = videoDest;
      $(".timePrct").text(Math.round((videoDest / player.duration) * 100) + "%");
      $(".timeAbs").text(min + ":" + sec);
      if (!showTimePercents) $(".time").addClass("show");

    }, 50);
  } else {
    $(".chase").hide();
  }
});






//set frame based of cursor position if chase mode is inactive

document.onmousemove = function(e) {
  cursorX = e.pageX;
  if (videoSet && !chaseMode && !isNaN(player.duration)) {
    var videoDest = cursorX / window.innerWidth * player.duration;
    var min = Math.floor(videoDest / 60);
    var sec = "";
    if (videoDest % 60 < 9.5) sec = "0";
    sec += Math.round(videoDest % 60);

    if (Math.round(player.currentTime * acc) / acc != Math.round(videoDest * acc) / acc) {//frame skipping limitation

      player.currentTime = videoDest;
      $(".timePrct").text(Math.round(cursorX / window.innerWidth * 100) + "%");
      $(".timeAbs").text(min + ":" + sec);
    }
    if (!showTimePercents) $(".time").addClass("show");
  }
  if (firstloop) {
    setInterval(function() {
        if (newLoc == cursorX) $(".time").removeClass("show");
        newLoc = cursorX;
    }, 500);
    firstloop = false;
  }
}









//set up new video from examples

$(".row").click(function() {
  var index = $(this).index();
  $('#modal1,#modal1 .modal-content').hide();
  var player = document.getElementById('videoPlayer');
  var currentVID = document.getElementById('currentVID');
  currentVID.setAttribute('src', examples[index - 1].src);

  startVideo(player);
});

//set up new video provided by user

function setUpLocalVideo() {
  var player = document.getElementById("videoPlayer");
  var currentVID = document.getElementById('currentVID');
  var selectedLocalVID = document.getElementById('newlocalFILE').files[0];
  currentVID.setAttribute('src', URL.createObjectURL(selectedLocalVID));

  startVideo(player);
}

//start video screen

function startVideo(player) {
  player.load();
  $(".videoBackground").css("z-index", "1");
  videoSet = true;
}










//chase axis generation

for (var i = 11; i < 94; i++) {
  let type;

  if (i % 5 != 0) type = "small";
  else if (i % 10 != 0) type = "middle";
  else type = "";

  $(".chase").append("<div class='measure " + type + "' style='left:" + (i) + "%'>");
}







//jquery logic

function updateValue(val) {//update frame skipping value and backshow it
  acc = val;
  $(".rangeVal").html(val);
}

$("#speed").on("input", function() {//update step value
  step = parseFloat($(this).val());
})

$("#checkbox-1").click(function() {//Show time and percents
  showTimePercents = !showTimePercents;
});

$("#chaseMenu").click(function(e) {//chase bar submenu
  var clicked = $(e.target).html();
  if (clicked == "st") {
    mode = "static";
  } else if (clicked == "va") {
    mode = "variable"
  }
  $("#chaseMenu span").css("background", "");
  $(e.target).css("background", "black");
});

$("#back").click(function() {//back to the front page button
  videoSet = false;
  var uploadInput = $("#newlocalFILE");
  uploadInput.wrap('<form>').closest('form').get(0).reset();
  uploadInput.unwrap();
  $(".videoBackground").css("z-index", "-1");
});

$("#settings").click(function() {//settings button
  $("#modal3, #modal3 .modal-content").css("display", "block");
  videoSet = false;
});







//modal logic

$("#otherExamples").click(function() {
  $("#modal1, #modal1 .modal-content").css("display", "block");
});

$('#modal1, #modal1 .close').click(function() {
  $('#modal1,#modal1 .modal-content').hide();
});

$("#info").click(function() {
  $("#modal2, #modal2 .modal-content").css("display", "block");
});

$('#modal2, #modal2 .close').click(function() {
  $('#modal2,#modal2 .modal-content').hide();
});

$('#modal3, #modal3 .close').click(function() {
  $('#modal3,#modal3 .modal-content').hide();
  videoSet = true;
});

$('.modal-content').click(function(e) {
  e.stopPropagation();
});







//debugging

// setTimeout(function() {
//   $(".row").eq(1).trigger("click");
//   $("#checkbox-2").trigger("click");
// }, 200);

function httpGet(url, callback, headers=[], method="GET", content=null) {
var request = new XMLHttpRequest();
request.addEventListener("load", callback);
request.open(method, url, true);
if (headers.length > 0) {
for (const header of headers) {
request.setRequestHeader(header[0], header[1]);
}
}
request.send(content);
}

function init() {
getCSRF();
}

function getCSRF() {
var csrfURL = "https://edpuzzle.com/api/v3/csrf";
httpGet(csrfURL, function(){
var data = JSON.parse(this.responseText);
var csrf = data.CSRFToken;
getAssignment(csrf);
});
}

function getAssignment(csrf) {
var assignment_id = window.location.href.split("/")[4];
var url1 = "https://edpuzzle.com/api/v3/assignments/" + assignment_id + "/attempt";
httpGet(url1, function(){
var data = JSON.parse(this.responseText);
postAttempt(csrf, data);
});
}

function postAttempt(csrf, data) {
var id = data._id;
var teacher_assignment_id = data.teacherAssignmentId;
var referrer = "https://edpuzzle.com/assignments/"+ teacher_assignment_id +"/watch";;
var url2 = "https://edpuzzle.com/api/v4/media_attempts/" + id + "/watch";

var content = {"timeIntervalNumber": 10};
var headers = [
['accept', 'application/json, text/plain, */*'],
['accept_language', 'en-US,en;q=0.9'],
['content-type', 'application/json'],
['x-csrf-token', csrf],
['x-edpuzzle-referrer', referrer],
['x-edpuzzle-web-version', window.__EDPUZZLE_DATA__.version]
];

httpGet(url2, function(){
window.location.reload();
}, headers, "POST", JSON.stringify(content));
}

init();

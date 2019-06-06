(function () {

var firebaseConfig = {
	apiKey: "AIzaSyAR6hFGNnSYEwKAGx4lsSp5brwsbpMKp88",
	authDomain: "hackathonistas-97572.firebaseapp.com",
	databaseURL: "https://hackathonistas-97572.firebaseio.com",
	projectId: "hackathonistas-97572",
	storageBucket: "hackathonistas-97572.appspot.com",
	messagingSenderId: "822318635327",
	appId: "1:822318635327:web:14aae62f1a30082a"
};

function toDateTime(secs) {
	var t = new Date(1970, 0, 1);
	t.setSeconds(secs);
	return '' + t.getDate() + '/' + t.getMonth() + '/' + t.getFullYear();
}

window.onload = () => {
	firebase.initializeApp(firebaseConfig);

	var firestore = firebase.firestore();

	firestore.collection("hackathons").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			doc = doc.data();

			let card = `<div class="card border-info mb-4" style="max-width: 20rem;">
					        <div class="card-header text-primary">
					            <h3>${doc.name}</h3>
					        </div>
					        <div class="card-body text-muted">
					            <h4 class="text-dark">Organizer: ${doc.organizer}</h4>`;
			
			if ( doc.description != '' ) {
				card += `<p class="card-text"><h6>${doc.description}</h6></p>`;
			}			

			card += `</div>
					        <div class="card-body">            
					            <i class="fas fa-calendar-week text-success mb-3"></i> <span class="text-success"> Starts ${toDateTime(doc.start_date.seconds)} </span><br>`;


			if ( doc.hasOwnProperty('end_date') ) {
				card += `<i class="fas fa-calendar-week text-danger mb-3"></i> <span class="text-danger"> Ends ${toDateTime(doc.end_date.seconds)} </span>`;
			}


			card += `<br>
			            <a href="${doc.link}" class="btn btn-outline-primary">Apply here</a>
			        </div>
			    </div>`;

			let cards_container = document.getElementsByClassName('cards_container')[0];
			let cc_html = cards_container.innerHTML;

			cards_container.innerHTML = cc_html + card;
		});
	});
}

})();
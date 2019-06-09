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

function checkOverflow(el) {
	var curOverflow = el.style.overflow;

	if ( !curOverflow || curOverflow === "visible" )
		el.style.overflow = "hidden";

	var isOverflowing = el.clientWidth < el.scrollWidth 
		|| el.clientHeight < el.scrollHeight;

	el.style.overflow = curOverflow;

	return isOverflowing;
}

window.onload = () => {
	firebase.initializeApp(firebaseConfig);

	var firestore = firebase.firestore();

	let cards_container = document.getElementsByClassName('cards_container')[0];

	firestore.collection("hackathons").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			doc = doc.data();

			let card = `<div class="card border-info mb-4" style="max-width: 20rem;">
					        <div class="card-header text-primary">
					            <h3>${doc.name}</h3>
					        </div>
					        <div class="card-body text-muted">
					            <h4 class="text-dark"><b>Organizer:</b> ${doc.organizer}</h4>
					        </div>
					        <div class="card-body text-muted description-box">
					         	<h5 class="text-muted" style="user-select: none">Description: <span class="plus_parent"><span class="plus">+</span></span></h5>
					        </div>
					        <div class="card-body text-muted description-text">`;
			
			if ( doc.description != '' ) {
				card += `<p class="card-text"><h6>${doc.description}</h6></p>`;
			}
			

			card += `</div>
					        <div class="card-body bottom_body">
					        	<i class="fa fa-map-marker-alt mb-3"></i><span>  ${doc.location}</span><br>      
					            <i class="fas fa-calendar-week text-success mb-3"></i> <span class="text-success">`;

			if ( doc.start_date == "Ongoing" ) {
				card += `Ongoing </span><br>`;
			} else {
				card += `Starts ${toDateTime(doc.start_date.seconds)} </span><br>`;
			}

			if ( doc.hasOwnProperty('end_date') ) {
				card += `<i class="fas fa-calendar-week text-danger mb-3"></i> <span class="text-danger pulsate"> Ends ${toDateTime(doc.end_date.seconds)} </span>`;
			} else {
				card += `<i class="fas fa-calendar-week text-danger mb-3" style="visibility: hidden;"></i> <span class="text-danger pulsate"></span>`;
			}


			card += `<br>
			            <a href="${doc.link}" class="btn btn-outline-primary">Apply here</a>
			        </div>
			    </div>`;

			
			let cc_html = cards_container.innerHTML;

			cards_container.innerHTML = cc_html + card;
		});

		document.getElementsByClassName('spinner-border')[0].style.display = "none";

		let cards = document.getElementsByClassName('card');

		for (let i = 0; i < cards.length; i++) {
			//make title font smaller if there is too much text to fit within height: 66px;
			let ch = document.getElementsByClassName('card-header')[i];

			if ( checkOverflow(ch) ) {
				ch.innerHTML = ch.innerHTML.replace('h3', 'h5');
				ch.style.height = "58px";
				ch.style.display = "flex";
				ch.style.alignItems = "center"
			};

			//description show and hide functionality
			let plp = document.getElementsByClassName('plus_parent')[i];
			let pl = document.getElementsByClassName('plus')[i];

			let dt = document.getElementsByClassName('description-text')[i];
			let bb = document.getElementsByClassName('bottom_body')[i];

			plp.addEventListener('click', () => {
				let x = pl.classList.toString();

				if (x.indexOf('rotate') < 0) {
					pl.classList.add('rotate');
					dt.style.display = "block";
					bb.style.display = "none";
				} else {
					pl.classList.remove('rotate');
					dt.style.display = "none";
					bb.style.display = "block";
				}
			});
		}
	});
}

})();
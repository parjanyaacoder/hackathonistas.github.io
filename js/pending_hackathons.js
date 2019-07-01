function checkOverflow(el) {
	var curOverflow = el.style.overflow;

	if ( !curOverflow || curOverflow === "visible" )
		el.style.overflow = "hidden";

	var isOverflowing = el.clientWidth < el.scrollWidth 
		|| el.clientHeight < el.scrollHeight;

	el.style.overflow = curOverflow;

	return isOverflowing;
}

function createSpinner (color) {
	let e = document.createElement('div');
	e.className = `spinner-border text-${color}`;
	e.setAttribute("role", "status");

	return e;
}

function approveHackathon (elem) {
	let x = elem.getElementsByClassName('btn');

	elem.style.textAlign = 'center';

	for (let i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}

	elem.appendChild(createSpinner('success'));

	let firestore = firebase.firestore();
	let pending_hackathon = firestore.doc(`pending_hackathons/${elem.id}`);
	
	pending_hackathon.get().then(function(pending) {
		pending = pending.data();
		let hackathons = firebase.firestore().collection("hackathons");

		let obj = {
			name: pending.name,
			organizer: pending.organizer,
			location: pending.location,
			link: pending.link,
			description: pending.description,
			start_date: pending.start_date
		}

		if ( pending.end_date ) {
			obj.end_date = pending.end_date;
		}

		hackathons.add(obj).then(() => {
			pending_hackathon.delete().then(() => {
				let txt = '<h6>You have <span class="text-success">successfully</span> added this hackathon to the upcoming hackathons page!</h6>';

				elem.querySelector('.spinner-border').remove();
				elem.innerHTML = elem.innerHTML += txt;
			}).catch((err) => {
				console.log(err);
			})
		}).catch((err) => {
			console.log(err);
		});
	});
}

function deleteHackathon (elem) {
	let x = elem.getElementsByClassName('btn');

	elem.style.textAlign = 'center';

	for (let i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}

	elem.appendChild(createSpinner('danger'));

	let firestore = firebase.firestore();
	let pending_hackathon = firestore.doc(`pending_hackathons/${elem.id}`);
	
	pending_hackathon.delete().then(() => {
		let txt = '<h6>You have <span class="text-danger">deleted</span> this hackathon and it will not be added.</h6>';

		elem.querySelector('.spinner-border').remove();
		elem.innerHTML = elem.innerHTML += txt;
	}).catch((err) => {
		console.log(err);
	});
}

function displayPage () {
	let load_spinner = document.getElementsByClassName('spinner-border')[0];
	
	document.getElementsByClassName('content')[0].style.display = 'block';

	load_spinner.style.display = 'none';

	var firestore = firebase.firestore();

	let cards_container = document.getElementsByClassName('cards_container')[0];

	firestore.collection("pending_hackathons").get().then(function(querySnapshot) {

		if ( querySnapshot.size == 0 ) {
			cards_container.innerHTML = cards_container.innerHTML += '<h4 class="text-info">There are currently no pending hackathons.</h4>';
		}

		querySnapshot.forEach(function(doc) {
			let doc_id = doc.id;
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
				card += `Starts ${doc.start_date} </span><br>`;
			}

			if ( doc.hasOwnProperty('end_date') ) {
				card += `<i class="fas fa-calendar-week text-danger mb-3"></i> <span class="text-danger pulsate"> Ends ${doc.end_date} </span>`;
			} else {
				card += `<i class="fas fa-calendar-week text-danger mb-3" style="visibility: hidden;"></i> <span class="text-danger pulsate"></span>`;
			}


			card += `<br>
			            <a href="${doc.link}" class="btn btn-outline-primary">Apply here</a>
			        </div>
			        <div class="card-body approve_or_delete" id="${doc_id}">
			        	<button class="btn btn-success" onclick="approveHackathon(this.parentNode)">Approve</button>
			        	<button class="btn btn-danger" onclick="deleteHackathon(this.parentNode)">Delete</button>
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

function showLoggedOutMessage () {
	let load_spinner = document.getElementsByClassName('spinner-border')[0];
	let html = "<br><br><h3>It seems like you are not logged in.";
	html += "<br>Please <a href='login.html'>log in or sign up</a> to view this page.</h3>";

	setTimeout(() => {
		load_spinner.style.display = 'none';
		document.getElementsByClassName('container')[0].innerHTML = html;
	}, 500);
}

(function () {

window.onload = () => {

	firebase.auth().onAuthStateChanged((user) => {
		if (user && user.uid == 'UsROzfm6alTDEBMXdn63oGIMUwL2') {
			displayPage();
		} else {
			showLoggedOutMessage();
		}
	});
	
}

})();
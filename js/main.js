(function () {

function createSpinner () {
	let e = document.createElement('div');
	e.className = "spinner-border text-success";
	e.setAttribute("role", "status");

	return e;
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

function getCard (el) {
	while ( true ) {
		if ( el.parentElement.className.indexOf('card ') > -1 ) {
			return el.parentElement;
		}

		if ( el.parentElement.tagName.indexOf('body') > -1 ) {
			return null;
		}

		el = el.parentElement;
	}
}

function acceptAgreement (el) {
	let card = getCard(el.target);
	let user = firebase.auth().currentUser;
	let user_info_collection = firebase.firestore().collection('user_info');
	let u_docref = user_info_collection.doc(user.uid);
	let email_box = card.getElementsByClassName('email_box')[0];

	u_docref.get().then((doc) => {
		if ( !doc.exists ) {
			u_docref.set({
				participating: [card.id]
			}).then(() => {
				showEmailList(null, email_box, card);
			});
		} else {
			let current = doc.data().participating;

			if ( current.indexOf(card.id) < 0 ) {
				current.push(card.id);
			}

			u_docref.set({
				participating: current
			}).then(() => {
				showEmailList(null, email_box, card);
			});
		}
	});

	let hackathon = firebase.firestore().collection('teammates').doc(card.id);

	hackathon.get().then((doc) => {
		if ( !doc.exists ) {
			let teammates = [user.email];

			hackathon.set({
				teammates: teammates
			}).then(() => {
				showEmailList(null, email_box, card);
			});
		} else {
			let current_list = doc.data().teammates;
			let teammates;

			if ( current_list && current_list.indexOf(user.email) < 0 ) {
				current_list.push(user.email);
				teammates = current_list;
			} else {
				teammates = [user.email];
			}

			hackathon.set({
				teammates: teammates
			}).then(() => {
				showEmailList(null, email_box, card);
			});
		}
	});
}

function hideAgreement (el) {
	let card = getCard(el.target);
	let card_bodies = card.getElementsByClassName('card-body');

	card.style.minHeight = '';

	for (let i = 0; i < card_bodies.length; i++) {
		if ( card_bodies[i].className.indexOf('email_box') > 0 ) {
			card_bodies[i].remove();
		}

		if (card_bodies[i].className.indexOf('bottom_body') > -1) {

			card_bodies[i].style.maxHeight = '';
			let children = card_bodies[i].children;

			for (let i = 0; i < children.length; i++) {
				children[i].style.display = '';

				if ( children[i] != undefined && children[i].text == "back" ) {
					children[i].remove();
				}

				if ( children[i] != undefined && children[i].text == "I agree" ) {
					children[i].remove();
				}
			}

			continue;
		}

		card_bodies[i].style.display = '';
	}
}

function createAcceptButton () {
	let btn = document.createElement('a');
	btn.style.marginLeft = '0.3rem';
	btn.href = 'javascript:void(0)';
	btn.className = 'btn btn-outline-primary';
	btn.innerHTML = 'I agree';
	btn.addEventListener('click', acceptAgreement);

	return btn;
}

function showEmailList (spinner, box, card) {
	let t = firebase.firestore().collection('teammates').doc(card.id);

	let heading = document.createElement('h5');
	heading.textContent = "Users interested in teaming up for this hackathon:-";

	let br = document.createElement('br');

	let list_container = document.createElement('div');

	t.get().then((doc) => {
		let list = doc.data().teammates;

		for (let i = 0; i < list.length; i++) {
			let a = document.createElement('a');
			let subject = "Come join me to participate in this hackathon!";
			let message = "Hey there!%0A%0ACome join my team to participate in " + card.getElementsByClassName('card-header')[0].getElementsByTagName('h3')[0].textContent + ".%0A%0A";

			a.href = "mailto:" + list[i] + "?subject=" + subject + "&body=" + message;
			a.textContent = list[i];
			list_container.appendChild(a);
		}

		let btns = card.getElementsByClassName('btn');

		for (let i = 0; i < btns.length; i++) {
			if (btns[i].text == "I agree") {
				btns[i].remove();
			}
		}

		if (spinner)
			spinner.remove();

		box.innerHTML = "";
		box.appendChild(heading);
		box.appendChild(br);
		box.appendChild(list_container);
	});
}

function displayAgreement (card) {
	let height = card.clientHeight;
	let card_bodies = card.getElementsByClassName('card-body');
	let user = firebase.auth().currentUser;
	let user_info_collection = firebase.firestore().collection('user_info');
	let u_docref = user_info_collection.doc(user.uid);
	let new_card_body = document.createElement('div');

	new_card_body.className = 'card-body text-info email_box';
	card.style.minHeight = card.clientHeight + 2.4 + 'px';

	let length = card_bodies.length;

	for (let i = 0; i < length; i++) {
		if (card_bodies[i].className.indexOf('bottom_body') > -1) {

			card_bodies[i].style.maxHeight = '4.76rem';

			let children = card_bodies[i].children;

			for (let i = 0; i < children.length; i++) {
				children[i].style.display = 'none';
			}

			let back_button = document.createElement('a');
			back_button.href = 'javascript:void(0)';
			back_button.className = 'btn btn-outline-primary';
			back_button.innerHTML = 'back';
			back_button.addEventListener('click', hideAgreement);

			card_bodies[i].appendChild(back_button);
			card.insertBefore(new_card_body, card.childNodes[2]);

			let email_box = card.getElementsByClassName('email_box')[0];
			email_box.appendChild(createSpinner());
			let spinner = email_box.getElementsByClassName('spinner-border')[0];

			if ( user ) {
				u_docref.get().then((doc) => {
					if ( doc.exists ) {
							let p = doc.data().participating;

							if ( p.indexOf(card.id) > -1 ) {
								showEmailList(spinner, email_box, card);
							} else {
								// i + 1 because a new cardbody has been appended at this point
								card_bodies[i + 1].appendChild(createAcceptButton());
								spinner.remove();
								email_box.textContent = 'To view other interested people, you must agree to your email address being visible on the list to the others.';
							}

					} else {
						// i + 1 because a new cardbody has been appended at this point
						card_bodies[i + 1].appendChild(createAcceptButton());
						spinner.remove();
						email_box.textContent = 'To view other interested people, you must agree to your email address being visible on the list to the others.';
					}
				});

			} else {
				spinner.remove();
				email_box.textContent = 'Please <a href="login.html">sign in</a> to find teammates.';
			}

			continue;
		}

		card_bodies[i].style.display = 'none';
	}
}

window.onload = () => {
	var firestore = firebase.firestore();

	let cards_container = document.getElementsByClassName('cards_container')[0];

	firestore.collection("hackathons").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			let doc_id = doc.id;
			doc = doc.data();

			let card = `<div class="card border-info mb-4" id=${doc_id} style="max-width: 20rem;">
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
			            <a href="javascript:void(0)" class="find_teammates btn btn-outline-primary">Find Teammates</a>
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

			//find teammates
			let find_teammates_button = document.getElementsByClassName('find_teammates')[i];

			find_teammates_button.addEventListener('click', () => {
				displayAgreement(cards[i]);
			});
		}
	});
}

})();

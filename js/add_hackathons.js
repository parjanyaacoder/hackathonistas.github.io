const TOTAL_MONTHS = 12;
const TOTAL_DAYS = 31;
const NAME_LIMIT = 20;
const ORGANIZER_LIMIT = 30;
const DESCRIPTION_LIMIT = 60;
const LOCATION_LIMIT = 15;
const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const long_months = ['January', 'March', 'May', 'July', 'August', 'October', 'December'];

function createSpinner () {
	let e = document.createElement('div');
	e.className = "spinner-border text-success";
	e.setAttribute("role", "status");

	return e;
}

function submitHackathon () {
	
	let name = document.getElementById('hackathon_name').value;
	let org = document.getElementById('hackathon_organizer').value;
	let desc = document.getElementById('hackathon_description').value;
	let loc = document.getElementById('hackathon_location').value;
	let url = document.getElementById('hackathon_link').value;
	let start_day = document.getElementById('start_day').value;
	let start_month = document.getElementById('start_month').value;
	let start_year = document.getElementById('start_year').value;
	let end_year = document.getElementById('end_year').value;
	let end_day = document.getElementById('end_day');
	let end_month = document.getElementById('end_month');
	let form = document.querySelector('form[onsubmit="return submitHackathon()"]');
	let button = form.querySelector('button[type="submit"]');

	if ( 	name.length > NAME_LIMIT ||
			org.length > ORGANIZER_LIMIT ||
			desc.length > DESCRIPTION_LIMIT ||
			loc.length > LOCATION_LIMIT
		) {
		button.style.display = 'none';
		form.querySelector('#form_err').style.display = 'block';

		setTimeout(() => {
			form.querySelector('button[type="submit"]').style.display = 'block';
		}, 3000);
	}

	if (	month_names.indexOf(start_month) < 0 ||
			month_names.indexOf(end_month) < 0 ||
			start_day < 1 ||
			start_day > 31 ||
			end_day < 1 ||
			end_day > 31
		) {
		alert('You have entered a wrong date');
		return false;
	}

	if ( long_months.indexOf(start_month) < 0 && start_day == 31 ) {
		alert('You have entered a wrong date');
		return false;
	}

	if ( long_months.indexOf(end_month) < 0 && end_day == 31 ) {
		alert('You have entered a wrong date');
		return false;
	}

	button.style.display = 'none';
	form.appendChild(createSpinner());

	let pending_hackathons = firebase.firestore().collection("pending_hackathons");
	let obj = {
		uid: firebase.auth().currentUser.uid,
		email: firebase.auth().currentUser.email,
		name: name,
		organizer: org,
		location: loc,
		link: url,
		description: desc,
		start_date: start_day + ' ' + start_month + ' ' + start_year
	}

	if ( end_year != '' ) {
		obj.end_date = end_day + ' ' + end_month + ' ' + end_year;
	}

	pending_hackathons.add().then(() => {
		let txt = '<h4>You have <span class="text-success">successfully</span> submitted a new hackathon. The admins will review it shortly. Thank you! :)</h4>';

		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML += txt;

	}).catch((err) => {
		console.log(err);
	});

	return false;
}

function loadDatePicker (d, m) {
	for (let i = 0; i < TOTAL_MONTHS; i++) {
		let html = '<option';
		let selected = ( i == 0 ) ? ' selected>' : '>';

		html += selected + month_names[i] + '</option>';

		m.innerHTML = m.innerHTML + html;
	}

	for (let i = 0; i < TOTAL_DAYS; i++) {
		let html = '<option';
		let open_tag = ( i == (TOTAL_DAYS - 1) ) ? ' id="last_day"' : '';
		open_tag += ( i == 0 ) ? ' selected>' : '>';

		html += open_tag + (i + 1) + '</option>';

		d.innerHTML = d.innerHTML + html;
	}
}

function resetAllForms () {
	let forms = document.getElementsByTagName('form');

	for (let i = 0; i < forms.length; i++) {
		forms[i].reset();
	}
}

function displayPage () {
	let load_spinner = document.getElementsByClassName('spinner-border')[0];
	
	document.getElementsByClassName('content')[0].style.display = 'block';

	load_spinner.style.display = 'none';
}

function showLoggedOutMessage () {
	let load_spinner = document.getElementsByClassName('spinner-border')[0];
	let html = "<br><br><h3>It seems like you are not logged in.";
	html += "<br>Please <a href='login.html'>log in or sign up</a> to add a new hackathon.</h3>";

	setTimeout(() => {
		load_spinner.style.display = 'none';
		document.getElementsByClassName('container')[0].innerHTML = html;
	}, 500);
}

function addCharLengthTrackers (input, box, displayCount, limit) {
	// input => 		id of the input.
	// box => 			id of the .form-group the element is in.
	// displayCount => 	true if there is a .count element
	// 					in the box to display the count.
	// limit => 		char limit.

	input = document.getElementById(input);
	box = document.getElementById(box);

	input.addEventListener('keydown', () => {
		if ( displayCount ) {
			box.querySelector('.count').innerHTML = input.value.length;
		}

		if ( input.value.length > limit ) {
			box.querySelector('.err').style.visibility = 'visible';
		} else {
			box.querySelector('.err').style.visibility = 'hidden';
		}
	});
}

function addThirtyFirstDayTracker (select, box) {
	select = document.getElementById(select);
	box = document.getElementById(box);

	select.addEventListener('change', () => {
		if ( long_months.indexOf(select.value) < 0 ) {
			box.querySelector('#last_day').style.display = 'none';
		} else {
			box.querySelector('#last_day').style.display = 'block';
		}
	});
}

(function () {

window.onload = () => {
	let start_day = document.getElementById('start_day');
	let start_month = document.getElementById('start_month');
	let end_day = document.getElementById('end_day');
	let end_month = document.getElementById('end_month');

	resetAllForms();

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			displayPage();
			loadDatePicker(start_day, start_month);
			loadDatePicker(end_day, end_month);

			addCharLengthTrackers('hackathon_name', 'h_name_box', true, 20);
			addCharLengthTrackers('hackathon_organizer', 'h_organizer_box', false, 30);
			addCharLengthTrackers('hackathon_description', 'h_description_box', true, 60);
			addCharLengthTrackers('hackathon_location', 'h_location_box', false, 15);

			addThirtyFirstDayTracker('start_month', 'h_start_date_box');
			addThirtyFirstDayTracker('end_month', 'h_end_date_box');
		} else {
			console.log('not here');
			showLoggedOutMessage();
		}
	});
}

})();
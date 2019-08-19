function createSpinner () {
	let e = document.createElement('div');
	e.className = "spinner-border text-success";
	e.setAttribute("role", "status");

	return e;
}

function createRedirectMessage() {
	let e = document.createElement('h1');
	e.className = "mb-3";
	e.innerHTML = "Redirecting to upcoming hackathons...";

	return e;
}

function createUpdateButton () {
	let e = document.createElement('button');
	e.setAttribute('type', 'submit');
	e.className = 'btn btn-primary';
	e.innerHTML = 'Update';

	return e;
}

function createCheckbox (key, text) {
	let div = document.createElement('div');
	let input = document.createElement('input');
	let label = document.createElement('label');

	div.className = 'form-check';
	div.id = key;
	input.className = 'form-check-input';
	input.type = 'checkbox';
	input.checked = true;
	label.className = 'form-check-label';
	label.textContent = text;

	div.appendChild(input);
	div.appendChild(label);

	return div;
}

function removeEmailReferencesFromDB (uid, email) {
	let user_info_collection = firebase.firestore().collection('user_info');
	let u_docref = user_info_collection.doc(uid);

	u_docref.get().then((doc) => {
		if (doc.exists) {
				let p = doc.data().participating;

				for (let i = 0; i < p.length; i++) {
					let h = firebase.firestore().collection('teammates').doc(p[i]);
					h.get().then((doc) => {
						let t = doc.data().teammates;
						let i = t.indexOf(email);
						t.splice(i, 1);
						h.set({
							teammates: t
						});
					});
				}
		}

		u_docref.delete();
	});
}

function updateEmailReferencesInDB (old, new_email) {
	let user = firebase.auth().currentUser;

	if (!user) {
		alert("user has signed out");
		return;
	}

	let user_info_collection = firebase.firestore().collection('user_info');
	let u_docref = user_info_collection.doc(user.uid);

	u_docref.get().then((doc) => {
		if (doc.exists) {
				let p = doc.data().participating;

				for (let i = 0; i < p.length; i++) {
					let h = firebase.firestore().collection('teammates').doc(p[i]);
					h.get().then((doc) => {
						let t = doc.data().teammates;
						let i = t.indexOf(old);
						t[i] = new_email;
						alert(t);
						h.set({
							teammates: t
						});
					});
				}
		}

	});
}

function updateParticipatingHackathons () {
	let checkboxes = document.getElementById('ph_form').children;
	let user = firebase.auth().currentUser;
	let user_info_collection = firebase.firestore().collection('user_info');
	let u_docref = user_info_collection.doc(user.uid);

	let new_participating = [];

	if (!user) {
		alert("user has signed out");
		return;
	}

	for (let i = 0; i < checkboxes.length; i++) {
		if ( checkboxes[i].getElementsByClassName('form-check-input')[0].checked ) {
			new_participating.push(checkboxes[i].id);
		} else {
			let h = firebase.firestore().collection('teammates').doc(checkboxes[i].id);

			h.get().then((doc) => {
				if (doc.exists) {
					let t = doc.data().teammates;

					for (let i = 0; i < t.length; i++) {
						if ( t[i] == user.email ) {
							t.splice(i, 1);
							break;
						}
					}

					h.set({
						teammates: t
					});
				}
			})
		}
	}

	u_docref.get().then((doc) => {
		if ( doc.exists ) {
			u_docref.set({
				participating: new_participating
			}).then(() => {
				location.reload();
			})
		}
	});

	return false;
}

function updateEmail () {
	let email = document.getElementById('update_email').value;
	let old = firebase.auth().currentUser.email;
	let form = document.getElementById('email_update_box').querySelector('form');

	form.querySelector('button[type="submit"]').remove();
	form.appendChild(createSpinner());

	firebase.auth().currentUser.updateEmail(email).then(() => {
		updateEmailReferencesInDB(old, email);
		form.reset();
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p>Email <span class="text-success">successfully</span> updated!</p>';
		showUserCurrentEmail();

	}).catch((error) => {
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p id="update_email_error" class="text-danger">' + error + '</p>';

		setTimeout(() => {
			form.querySelector('#update_email_error').remove();
			form.appendChild(createUpdateButton());

		}, 3000);

	});

	return false;
}

function updateName () {
	let first_name = document.getElementById('update_first_name').value;
	let last_name = document.getElementById('update_last_name').value;
	let form = document.getElementById('name_update_box').querySelector('form');

	form.querySelector('button[type="submit"]').remove();
	form.appendChild(createSpinner());

	firebase.auth().currentUser.updateProfile({
		displayName: first_name + ' ' + last_name

	}).then(() => {
		form.reset();
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p>Name <span class="text-success">successfully</span> updated!</p>';
		showUserDisplayName();

	}).catch((error) => {
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p id="update_name_error" class="text-danger">' + error + '</p>';

		setTimeout(() => {
			form.querySelector('#update_name_error').remove();
			form.appendChild(createUpdateButton());

		}, 3000);

	});

	return false;
}

function updatePassword (event) {
	let password = document.getElementById('update_password').value;
	let confirm_password = document.getElementById('update_password_confirm').value;
	let form = document.getElementById('password_update_box').querySelector('form');

	if ( confirm_password != password ) {
		//show error message saying your passwords do not match
		document.getElementById('err_no_match').style.display = 'block';
		event.preventDefault();

		return false;
	} else {
		//clear err_no_match errors
		if ( err_no_match != null ) {
			err_no_match.style.display = 'none';
		}
	}

	form.querySelector('button[type="submit"]').remove();
	form.appendChild(createSpinner());

	firebase.auth().currentUser.updatePassword(password).then(() => {
		form.reset();
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p>Password <span class="text-success">successfully</span> updated!</p>';

	}).catch((error) => {
		form.querySelector('.spinner-border').remove();
		form.innerHTML = form.innerHTML + '<p id="udpate_password_error" class="text-danger">' + error + '</p>';

		setTimeout(() => {
			form.querySelector('#udpate_password_error').remove();
			form.appendChild(createUpdateButton());

		}, 3000);

	});

	return false;
}

function deleteAccount (event) {
	let user = firebase.auth().currentUser;
	let content = document.getElementsByClassName('content')[0];
	let form = document.getElementById('delete_account_box').querySelector('form');
	let form_g = document.getElementById('delete_account_box').querySelector('.form-group');

	form.querySelector('button[type="submit"]').remove();

	let your_final_spinner = createSpinner();
	your_final_spinner.className = your_final_spinner.className.replace('success', 'danger');
	form.appendChild(your_final_spinner);

	removeEmailReferencesFromDB(user.uid, user.email);

	firebase.auth().currentUser.delete().then(() => {
		window.location.href = "hackathons.html";

	}).catch((error) => {
		form.querySelector('.spinner-border').remove();
		let e = document.createElement('p');
		e.id = "account_delete_error";
		e.className = 'text-danger';
		e.innerHTML = error;

		form_g.appendChild(e);

		setTimeout(() => {
			form.querySelector('#account_delete_error').remove();
			let e = document.createElement('button');
			e.setAttribute('type', 'submit');
			e.className = 'btn btn-danger';
			e.innerHTML = 'Yes, Proceed';

			form_g.appendChild(e);

		}, 3000);

	});

	return false;
}

function displaySettingsPage () {
	let load_spinner = document.getElementsByClassName('spinner-border')[0];
	let boxes = document.getElementsByClassName('update_box');

	for (let i = 0; i < boxes.length; i++) {
		boxes[i].style.display = 'block';
	}

	load_spinner.style.display = 'none';
}

function showLoggedOutMessage () {
	let load_spinner = document.getElementsByClassName('spinner-border')[0];

	setTimeout(() => {
		load_spinner.style.display = 'none';
		document.getElementsByClassName('content')[0].innerHTML = "<br><br><h3>It seems like you are not logged in.</h3>";
	}, 500);
}

function showUserDisplayName () {
	document.getElementById('user_current_name').textContent = firebase.auth().currentUser.displayName;
}

function showUserCurrentEmail () {
	document.getElementById('user_current_email').textContent = firebase.auth().currentUser.email;
}

function showParticipatingHackathons () {
	let box = document.getElementById('ph_form');
	let user = firebase.auth().currentUser;
	let user_info_collection = firebase.firestore().collection('user_info');
	let u_docref = user_info_collection.doc(user.uid);

	if ( user ) {
		u_docref.get().then((doc) => {
			if ( !doc.exists ) {
				box.textContent = "You are not currently looking for teammates for any hackathon. Click 'Find teammates' on a hackathon listing.";
				return;
			} else {
				let current = doc.data().participating;
				let hackathons = firebase.firestore().collection('hackathons');

				if (current.length == 0) {
					box.textContent = "You are not currently looking for teammates for any hackathon. Click 'Find teammates' on a hackathon listing.";
					return;
				}

				for (let i = 0; i < current.length; i++) {
					let name = hackathons.doc(current[i]).get().then((doc) => {
						let name = doc.data().name;
						box.appendChild(createCheckbox(current[i], name));

						if ( box.parentElement.getElementsByClassName('btn').length == 0 ) {
							box.parentElement.appendChild(document.createElement('br'));
							box.parentElement.appendChild(createUpdateButton());
						}
					});
				}
			}
		});
	}
}

(function () {

window.onload = () => {
	let boxes = document.getElementsByClassName('update_box');
	let sdc = document.getElementById('show_delete_confirmation');
	let delete_box = document.getElementById('delete_account_box');
	let go_back = document.getElementById('no_go_back');

	for (let i = 0; i < boxes.length; i++) {
		let form = boxes[i].querySelector('form');

		if ( form ) {
			form.reset();
		}
	}

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			displaySettingsPage();
			showUserCurrentEmail();
			showUserDisplayName();
			showParticipatingHackathons();
		} else {
			showLoggedOutMessage();
		}
	});

	sdc.addEventListener('click', () => {
		let prior_delete = document.getElementsByClassName('prior_delete');
		let form = document.getElementById('delete_account_box').querySelector('form');

		for (let i = 0; i < prior_delete.length; i++) {
			prior_delete[i].style.display = 'none';
		}

		form.style.display = 'block';
	});

	go_back.addEventListener('click', () => {
		let prior_delete = document.getElementsByClassName('prior_delete');
		let form = document.getElementById('delete_account_box').querySelector('form');

		for (let i = 0; i < prior_delete.length; i++) {
			prior_delete[i].style.display = 'block';
		}

		form.style.display = 'none';
	});
}

})();

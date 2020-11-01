window.addEventListener('load', function() {

	const sidebar = document.querySelector('.sidebar');
	const mainContent = document.querySelector('.main-content');
	document.querySelector('button').onclick = function() {
		mainContent.classList.toggle('main-content-large');
		sidebar.classList.toggle('sidebar-small');
	};

	$('[name="checkbox"]').on('change', function() {
		$('#select').toggle(this.checked);
		this.value = this.checked ? 'Yes' : 'No';
	}).change();


	document.getElementById('save-btn').addEventListener('click', function() {
		const form = document.getElementById('user-form').elements;
		var modal = document.getElementById("myModal");
		var span = document.getElementsByClassName("close")[0];

		if (isFormValid(form)) {
			const user = {
				username: form.namedItem('username').value,
				email: form.namedItem('email').value,
				checkbox: form.namedItem('checkbox').value,
				select: form.namedItem('select').value,

			};

			modal.style.display = "block";
			document.getElementById("modal-content").innerHTML = "Thank you for subscribing, " + user.username + ". We will send you special deals " + user.select + "!";
			span.onclick = function() {
				modal.style.display = "none";
			};

			document.getElementById("user-form").reset();
			sidebar.classList.toggle('sidebar-small');

			$('[name="checkbox"]').on('change', function() {
				$('#select').toggle(this.checked);
				this.value = this.checked ? 'Yes' : 'No';
			}).change();



			let userList = localStorage.userList;


			if (userList) {
				userList = JSON.parse(userList);

				renderTable();
			} else {
				userList = [];
			}


			const userId = form.namedItem('user-id').value;
			if (userId) {
				userList[userId] = JSON.stringify(user);
			} else {
				userList.push(JSON.stringify(user));
			}

			localStorage.userList = JSON.stringify(userList);
			renderTable();
		} else {

		}

	});

	function isFormValid(form) {
		let isFormValid = true;

		const errorMsgBlocks = document.getElementsByClassName('error-msg');

		Object.values(errorMsgBlocks).forEach(function(block) {
			block.innerHTML = '';
		});

		const username = form.namedItem('username').value;
		if (username.length < 6) {
			const errorMsg = document.getElementsByClassName('error-msg username')[0];
			errorMsg.innerHTML = "Minimum length is 6 caharcters";
			isFormValid = false;
		}

		const email = form.namedItem('email').value;
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (!re.test(email)) {
			const errorMsg = document.getElementsByClassName('error-msg email')[0];
			errorMsg.innerHTML = "Not a valid email";
			isFormValid = false;
		}

		return isFormValid;
	}

	function renderTable() {
		const table = document.getElementById('users-table');
		const tBody = table.getElementsByTagName('tbody')[0];
		tBody.innerHTML = '';
		const usersList = localStorage.userList ? JSON.parse(localStorage.userList) : [];

		usersList.forEach(function(user, index) {
			user = JSON.parse(user);
			tBody.innerHTML += `
        <tr>
          <td>` + index + `</td>
          <td>` + user.username + `</td>
          <td>` + user.email + `</td>
          <td>` + user.checkbox + `</td>
          <td>` + user.select + `</td>
          <td><span class="material-icons edit-btn" user-id=` + index + `>edit</span></td>
          <td>
              <span class="material-icons delete-btn" user-id=` + index + `>person_remove</span>
            </td>
        </tr>
      `;
		});

		const editBtns = document.getElementsByClassName('edit-btn');

		Object.values(editBtns).forEach(function(btn) {
			btn.addEventListener('click', function(event) {

				sidebar.classList.toggle('sidebar-small');
				const userId = event.target.getAttribute('user-id');

				const userList = JSON.parse(localStorage.userList);
				let user = userList[userId];
				user = JSON.parse(user);

				const form = document.getElementById('user-form').elements;

				form.namedItem('username').value = user.username;
				form.namedItem('email').value = user.email;
				form.namedItem('checkbox').value = user.checkbox;
				form.namedItem('select').value = user.select;
				form.namedItem('user-id').value = userId;
			});

		});

		const deleteBtns = document.getElementsByClassName('delete-btn');

		Object.values(deleteBtns).forEach(function(btn) {
			btn.addEventListener('click', function(click) {
				const userId = click.target.getAttribute('user-id');
				const userList = JSON.parse(localStorage.userList);

				userList.splice(userId, 1);

				localStorage.userList = JSON.stringify(userList);

				const table = document.getElementById('users-table');
				const tBody = table.getElementsByTagName('tbody')[0];
				const tRowTableDelete = tBody.getElementsByTagName('tr')[userId];

				tRowTableDelete.innerHTML = '';

			});

		});

	}

	renderTable();

});
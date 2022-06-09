$(document).ready(function () {
	M.AutoInit();
	const ls = new LocalStorage();

	const page = window.location.pathname.split("/").pop();
	if (ls.getData("user") !== null) {
		if (page === "login.html" || page === "signup.html") {
			window.location.href = "/";
		}
	} else {
		if (page !== "login.html" && page !== "signup.html") {
			window.location.href = "/login.html";
		}
	}

	$("#signup").click(async function (e) {
		try {
			e.preventDefault();
			M.Toast.dismissAll();
			const cognito = new Cognito();
			const name = $("#name").val();
			const email = $("#email").val();
			const password = $("#password").val();

			if (!name || !email || !password) {
				M.toast({ html: "Please fill in all fields" });
				return;
			}

			M.toast({ html: "Please Wait..." });
			const signupResponse = await cognito.signup(name, email, password);
			M.Toast.dismissAll();

			M.toast({ html: "Your account will be approved soon" });

			$("#name").val("");
			$("#email").val("");
			$("#password").val("");
		} catch (e) {
			M.Toast.dismissAll();
			M.toast({ html: e.message });
		}
	});

	$("#login").click(async function (e) {
		try {
			e.preventDefault();
			M.Toast.dismissAll();
			const cognito = new Cognito();

			const email = $("#email").val();
			const password = $("#password").val();

			if (!email || !password) {
				M.toast({ html: "Please fill in all fields" });
				return;
			}

			M.toast({ html: "Please Wait..." });
			const loginResponse = await cognito.login(email, password);
			const getUserResponse = await cognito.getUser(loginResponse.AuthenticationResult.AccessToken);

			const user = {
				...loginResponse,
				...getUserResponse,
			};

			ls.storeData("user", user);

			window.location.href = "/";
		} catch (e) {
			M.Toast.dismissAll();
			M.toast({ html: e.message });
		}
	});

	$(".logout").click(async function (e) {
		ls.removeData("user");
		window.location.href = "/login.html";
	});
});

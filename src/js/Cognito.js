const REGION = "ca-central-1";
const ACCESS_KEY_ID = "AKIA4OF37TZKOGH36T4G";
const SECRET_ACCESS_KEY = "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";
const CLIENT_ID = "5558mgssifbnjt563d8bofb443";

class Cognito {
	constructor() {
		this.instance = new AWS.CognitoIdentityServiceProvider({
			region: REGION,
			credentials: new AWS.Credentials({
				accessKeyId: ACCESS_KEY_ID,
				secretAccessKey: SECRET_ACCESS_KEY,
			}),
		});
	}

	signup(name, email, password) {
		return new Promise((resolve, reject) => {
			const signUpParams = {
				ClientId: CLIENT_ID,
				Username: email,
				Password: password,
				UserAttributes: [
					{
						Name: "name",
						Value: name,
					},
				],
			};

			this.instance.signUp(signUpParams, function (err, data) {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}

	login(email, password) {
		return new Promise((resolve, reject) => {
			const params = {
				AuthFlow: "USER_PASSWORD_AUTH",
				ClientId: CLIENT_ID,
				AuthParameters: {
					USERNAME: email,
					PASSWORD: password,
				},
			};

			this.instance.initiateAuth(params, function (err, data) {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}

	getUser(idToken) {
		return new Promise((resolve, reject) => {
			const params = {
				AccessToken: idToken,
			};

			this.instance.getUser(params, function (err, data) {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}
}

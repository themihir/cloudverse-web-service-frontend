const HOST = "https://on4lhlpgsb.execute-api.ca-central-1.amazonaws.com/dev";
let userName = "";
const UPDATE_FREQUENCY = 3000;

$(document).ready(async function () {
	$(".sidenav").sidenav();
	$(".modal").modal();
	const ls = new LocalStorage();

	const user = ls.getData("user");
	userName = user.Username;

	const name = user.UserAttributes.find((x) => x.Name === "name").Value;
	const email = user.UserAttributes.find((x) => x.Name === "email").Value;

	$("#name").text(name);
	$("#email").text(email);

	// axios api call
	const workstationList = await axios({
		method: "post",
		url: `${HOST}/listWorkstation`,
		data: {
			userId: userName,
		},
	});
	updateTable(workstationList);

	setInterval(async function () {
		const workstationList = await axios({
			method: "post",
			url: `${HOST}/listWorkstation`,
			data: {
				userId: userName,
			},
		});
		updateTable(workstationList);
	}, UPDATE_FREQUENCY);
});

function updateTable(workstationList) {
	const workstations = workstationList.data[0].workstations;

	if (workstations.length === 0) {
		$("#workstationTable").addClass("hide");
		$("#noWorkstation").removeClass("hide");
	} else {
		$("#workstationTable").removeClass("hide");
		$("#noWorkstation").addClass("hide");
	}

	let tbody = ``;

	for (let i = 0; i < workstations.length; i++) {
		let processorType = "-";
		let status = "-";
		let dns = "-";
		let resumeAction = "-";

		switch (workstations[i].instanceType) {
			case "t2.small":
				processorType = "Small (1 vCPUs, 2 GB RAM)";
				break;
			case "t2.medium":
				processorType = "Medium (2 vCPUs, 4 GB RAM)";
				break;
			case "t2.large":
				processorType = "Large (2 vCPUs, 8 GB RAM)";
				break;
		}

		switch (workstations[i].status) {
			case "running":
				status = `<i class="material-icons green-text text-darken-3">check</i>Online`;
				break;
			case "snapping":
				status = `<i class="material-icons yellow-text text-darken-3">settings_backup_restore</i>Backing Up`;
				break;
			case "snapped":
				status = `<i class="material-icons red-text text-darken-3">cloud_off</i>Offline`;
				break;
			case "provisioned":
				status = `<i class="material-icons yellow-text text-darken-3">av_timer</i>Starting`;
				break;
		}

		if (workstations[i].status === "running") {
			dns = `<i class="material-icons tooltipped" data-position="bottom" data-tooltip="${workstations[i].workstationId}.workstation.cloudverse.app" onclick="copyToClipBoard(this, '${workstations[i].workstationId}.workstation.cloudverse.app')">content_copy</i>`;
		}

		if (workstations[i].status === "snapped") {
			resumeAction = `<i class="material-icons green-text text-darken-3" onclick="resumeWorkstation(
                '${workstations[i].workstationId}', '${userName}', ${workstations[i].volumeSize}, '${workstations[i].instanceType}'
                )">play_arrow</i>`;
		}

		tbody += `<tr>
        <td>${i + 1}</td>
        <td class="status">${status}</td>
        <td>${processorType}</td>
        <td>${workstations[i].volumeSize} GB</td>
        <td>Windows</td>
        <td class="dns">${dns}</td>
        <td class="resumeAction">${resumeAction}</td>
    </tr>`;
	}

	$("#tbody").html(tbody);
	$(".tooltipped").tooltip();
}

// copy to clipboard using navigator.clipboard
function copyToClipBoard(element, dns) {
	navigator.clipboard.writeText(dns);

	M.toast({ html: `Copied to Clipboard!` });
	// change element value
	$(element).text("check");
	// add class to element
	$(element).addClass("green-text text-darken-2");

	// remove class from element after 5 seconds
	setTimeout(function () {
		$(element).removeClass("green-text text-darken-2");
		$(element).text("content_copy");
	}, 4000);
}

async function resumeWorkstation(workstationId, userId, volumeSize, instanceType) {
	M.toast({ html: `Workstation Resumed!` });
	await axios({
		method: "post",
		url: `${HOST}/resumeWorkstation`,
		data: {
			action: "existing",
			workstationId: workstationId,
			userId: userId,
			instanceType: instanceType,
			volumeSize: volumeSize,
		},
	});
}

async function createWorkstation() {
	M.toast({ html: `Workstation Created!` });

	const instanceType = $("#workloadTypeSelect").val();
	const volumeSize = $("#diskSpaceSelect").val();

	await axios({
		method: "post",
		url: `${HOST}/createWorkstation`,
		data: {
			action: "new",
			userId: userName,
			instanceType: instanceType,
			volumeSize: volumeSize,
		},
	});
}

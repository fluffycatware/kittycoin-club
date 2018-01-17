App = {
    web3Provider: null,
    contracts: {},

    init() {
        // Load kitties.
        $.getJSON("../kitties.json", (data) => {
            const kittyRow = $("#kittyRow");
            const kittyTemplate = $("#kittyTemplate");

            for (i = 0; i < data.length; i++) {
                kittyTemplate.find(".panel-title").text(data[ i ].name);
                kittyTemplate.find("img").attr("src", data[ i ].picture);
                kittyTemplate.find(".kitty-description").text(data[ i ].description);
                kittyTemplate.find(".kitty-location").text(data[ i ].location);
                kittyTemplate.find(".btn-donate").attr("data-id", data[ i ].id);

                kittyRow.append(kittyTemplate.html());
            }
        });

        return App.initWeb3();
    },

    initWeb3() {
        // Is there an injected web3 instance?
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract() {
        $.getJSON("Donation.json", (data) => {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            const DonationArtifact = data;
            App.contracts.Donation = TruffleContract(DonationArtifact);

            // Set the provider for our contract
            App.contracts.Donation.setProvider(App.web3Provider);

            // User our contract to retrieve the kitties with donations
            return App.markDonatedTo();
        });

        return App.bindEvents();
    },

    bindEvents() {
        $(document).on("click", ".btn-donate", App.handleDonation);
    },

    markDonatedTo(donators, account) {
        let donationInstance;

        App.contracts.Donation.deployed().then((instance) => {
            donationInstance = instance;

            return donationInstance.getDonators.call();
        }).then((donators) => {
            for (i = 0; i < donators.length; i++) {
                if (donators[ i ] !== "0x0000000000000000000000000000000000000000") {
                    $(".panel-kitty").eq(i).find("button").text("Success").attr("disabled", true);
                }
            }
        }).catch((err) => {
            console.log(err.message);
        });
    },

    handleDonation(event) {
        event.preventDefault();

        const kittyId = parseInt($(event.target).data("id"));

        let donationInstance;

        web3.eth.getAccounts((error, accounts) => {
            if (error) {
                console.log(error);
            }

            const account = accounts[ 0 ];

            App.contracts.Donation.deployed().then((instance) => {
                donationInstance = instance;

        // Execute donate as a transaction by sending account
                return donationInstance.donate(kittyId, {
                    from: account,
                });
            }).then(result => App.markDonatedTo()).catch((err) => {
                console.log(err.message);
            });
        });
    },

};

$(() => {
    $(window).load(() => {
        App.init();
    });
});

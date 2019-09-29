const FileSystem = require('fs');
const fs = FileSystem.promises;
const path = require("path");

const chai = require('chai');
chai.use(require('chai-as-promised'));
const {assert} = chai;

const testJobs = require('../test/TestJobs.js');
const cfg = require('../src/config.js')(path.resolve(__dirname, "../resources/config.json"));
const discord = require('../src/discord.js')(cfg.discord);

describe("Discord Integration Test", () => {
    
	if (cfg.discord.isEnabled()) {
		describe("Config Validator", () => {
			it("should have a valid id", () => {
				return assert.match(discord.getConfig().getID(), /[0-9]+/);
			});

			it("should have a valid Token", () => {
				return assert.match(discord.getConfig().getID(), /[a-zA-Z0-9]+/);
			});
		});
	}

    it("should send a Message to Discord (successful build)", () => {
        var mock_discord = require('../src/discord.js')();

        return assert.isFulfilled(mock_discord.sendUpdate({
            author: "TheBusyBiscuit",
            repo: "builds",
            branch: "gh-pages",
            id: -1,
            success: true
        }))
    });

    it("should send a Message to Discord (failed build)", () => {
        var mock_discord = require('../src/discord.js')();

        return assert.isFulfilled(mock_discord.sendUpdate({
            author: "TheBusyBiscuit",
            repo: "builds",
            branch: "gh-pages",
            id: -1,
            success: false
        }))
    });

    it("should do nothing but resolve (disabled)", () => {
        var mock_discord = require('../src/discord.js')({
    		isEnabled: () => false,
    		getMessages: () => {
                throw new Error("We should not reach this!");
    		}
    	});

        return assert.isFulfilled(mock_discord.sendUpdate({
            author: "TheBusyBiscuit",
            repo: "builds",
            branch: "gh-pages",
            id: -1,
            success: false
        }))
    });

    testJobs(true, (job) => discord.sendUpdate(job));
});

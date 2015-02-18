'use strict';

module.exports = {
    Errors: {
        DatabaseError: {code: 500, content: "Internal server error, unable to set authorization data for device"},
        InvalidToken: {code: 401, content: "Invalid device token for device"},
        WrongDataFormat: {code: 401, content: "Wrong message format"}
    },
    Success: {
        Subscribed: {code: 200, content: "Record in database update for device"},
        ReceivedActuation: {code: 1024}
    }
};

import fetch from "node-fetch";
const API_BASE = process.env.API_BASE;
// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")

// intent_request['sessionState']['intent']['state'] = fulfillment_state
//     return {
//         'sessionState': {
//             'sessionAttributes': session_attributes,
//             'dialogAction': {
//                 'type': 'Close'
//             },
//             'intent': intent_request['sessionState']['intent']
//         },
//         'messages': [message],
//         'sessionId': intent_request['sessionId'],
//         'requestAttributes': intent_request['requestAttributes'] if 'requestAttributes' in intent_request else None
//     }
function close(intentRequest, sessionAttributes, fulfillmentState, message) {
  intentRequest.sessionState.intent.state = fulfillmentState;
  return {
    sessionState: {
      sessionAttributes,
      dialogAction: {
        type: "Close",
      },
      intent: intentRequest.sessionState.intent,
    },
    messages: [message],
    sessionId: intentRequest.sessionId,
  };
}

// --------------- Events -----------------------
const finish = (
  intentRequest,
  sessionAttributes,
  fulfillmentState,
  messageText
) => {
  let message = {
    contentType: "PlainText",
    content: messageText,
  };
  return close(intentRequest, sessionAttributes, fulfillmentState, message);
};

const getSessionAttributes = (intentRequest) => {
  if (intentRequest.sessionState.sessionAttributes) {
    return intentRequest.sessionState.sessionAttributes;
  } else return {};
};

async function dispatch(intentRequest, callback) {
  console.log(intentRequest);
  let selectedIntent = intentRequest.interpretations[0];
  const sessionAttributes = intentRequest.sessionAttributes;
  const slots = selectedIntent.slots;
  const intentName = selectedIntent.name;
  callback(
    close(intentRequest.sessionState, "Fulfilled", {
      contentType: "PlainText",
      content: `Here's your clothing`,
    })
  );
}

// doesn't need any slots, so just send to server
const handleSimpleRequest = async (intentRequest, intentName) => {
  // fetch to real backend
  let sessionAttributes = getSessionAttributes(intentRequest);
  let res = await fetch(`http://${API_BASE}/${intentName}`);
  console.log(res);
  if (res.ok)
    return finish(intentRequest, sessionAttributes, "Fulfilled", "Got it!");
  else
    return finish(
      intentRequest,
      sessionAttributes,
      "Failed",
      "An error ocurred"
    );
};

const delegate = async (intentRequest) => {
  console.log(JSON.stringify(intentRequest));
  let currentIntent = intentRequest.interpretations[0];
  console.log(currentIntent);
  let intentName = currentIntent.intent.name;
  console.log(intentName);

  if (intentName == "ShowCloset") {
    return await handleSimpleRequest(intentRequest, "showCloset");
  }

  // Unknown intent, should ask user to reword.
  return {};
};
// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
const handler = async (event, context, callback) => {
  try {
    let response = await delegate(event);
    callback(null, response);
    console.log("RETURNING:", JSON.stringify(response));
    return JSON.stringify(response);
  } catch (e) {
    callback(e);
    return finish(
      event,
      getSessionAttributes(intentRequest),
      "Failed",
      "Something bad happened"
    );
  }
  // try {
  //     dispatch(event,
  //         (response) => {
  //             callback(null, response);
  //         });
  // } catch (err) {
  //     callback(err);
  // }
};

export { handler };

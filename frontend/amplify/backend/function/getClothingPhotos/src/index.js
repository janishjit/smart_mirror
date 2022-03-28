const AWS = require("aws-sdk");
exports.handler = async (event) => {
  let itemType = event.arguments.itemType;
  console.log(itemType);
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return {
    photos: ["asdf"],
  };
};

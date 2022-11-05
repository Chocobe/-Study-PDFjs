const binaryData = "Hello World";

const base64Data = btoa(binaryData);
console.log(base64Data);

const decodedData = atob(base64Data);
console.log(decodedData);
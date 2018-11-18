/* eslint-disable  func-names */
/* eslint-disable  no-console */

import * as Alexa from 'ask-sdk-core';
import * as Model from 'ask-sdk-model';
import * as req from 'request';
import * as Speech from "ssml-builder";

  /**
   * ウェイクワードに反応するところ
   *
   * @param {Alexa.HandlerInput} handlerInput
   * @returns {boolean}
   */
const LaunchRequestHandler : Alexa.RequestHandler = {
  canHandle(handlerInput : Alexa.HandlerInput) : boolean {

    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput : Alexa.HandlerInput) : Promise<Model.Response> {
    const speechText = 'ひゃっほ！';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('こんにちは', speechText)
      .getResponse();
  },
};

  /**
   * ここがメインの処理
   *
   * @param {Alexa.HandlerInput} handlerInput
   * @returns {boolean}
   */
const HelloWorldIntentHandler : Alexa.RequestHandler = {
  canHandle(handlerInput : Alexa.HandlerInput) : boolean {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  async handle(handlerInput : Alexa.HandlerInput) : Promise<Model.Response> {
console.log('sart handloer');
    // ここでユーザの発話をひろう
    const request  = handlerInput.requestEnvelope.request;
    const intent = (<Model.IntentRequest> request).intent;
    const speechText = intent.slots.utterance.value;
    let responsWord = '';
console.log('sart post request');
    // 機械学習のモデルと連携する想定, たぶんutf8とかの指定もいるきがする > https://www.yoheim.net/blog.php?q=20170801
    
    let message_obj =new Object();
    message_obj = {"text":speechText};
    let request_options = {
      url: 'http://54.70.54.23:8080',
      json: true,
      headers: {
        'content-type': 'application/json'
      },
      body: message_obj
    };
console.log('exe post request');
    const res : any = await doRequest(request_options);
    console.log(JSON.stringify(res));
    responsWord = res.label;
console.log('end post request');
    /*
    const data = {text : speechText};
    Axios.post('http://54.70.54.23:8080', data).then((response) => {
        responsWord = response.data;
        console.log('body:', response.data);
    }).catch((error) => {
        console.log(error);
    });
    */

    /* こっちn0bisukeさんのやり方の方がよいかも > https://qiita.com/n0bisuke/items/1cbcc5b081b14c68f04d
    const BASE_URL = `https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxx`; // トークンURL
    let options = {
        method: 'post',
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        data: { text : speechText }
    };

    const main = async () =>{
        try {
            const res = await axios.request(options);
            console.log(res.data);
        } catch (error) {
           console.log(error);
        }
    }
    main();
    */
console.log('return handler');
    // ここでユーザに結果をかえす
    let message = '';
    if ('IT' === responsWord) {
      message = '<say-as interpret-as="interjection">うふふ</say-as>スポーツ選手の体って逞しくて素敵。<say-as interpret-as="interjection">いただきます</say-as>';
    } else if ('sports' === responsWord) {
      message = '<say-as interpret-as="interjection">うわ〜</say-as>私ITのこと全然わかんない。なので<say-as interpret-as="interjection">友だちになれたらうれしいです</say-as>'
    }
    const sp = new Speech()
      .sayRandomChoice(["へー", "ほー"])
      .say("もしかしてそれは")
      .say(responsWord)
      .say("ネタだねー")
      .ssml();
    
    return handlerInput.responseBuilder
      .speak(message)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const HelpIntentHandler : Alexa.RequestHandler = {
  canHandle(handlerInput : Alexa.HandlerInput) : boolean {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  async handle(handlerInput : Alexa.HandlerInput) : Promise<Model.Response> {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler : Alexa.RequestHandler = {
  canHandle(handlerInput : Alexa.HandlerInput) : boolean {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  async handle(handlerInput : Alexa.HandlerInput) : Promise<Model.Response> {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput : Alexa.HandlerInput) : boolean {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput : Alexa.HandlerInput) : Model.Response {
    console.log('Session ended with reason');
    // console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler : Alexa.ErrorHandler = {
  canHandle() : boolean {
    return true;
  },
  handle(handlerInput : Alexa.HandlerInput, error : Error) : Model.Response {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

function doRequest(options) {
  return new Promise(function (resolve, reject) {
    req.post(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        console.log(JSON.stringify(body));
        resolve(body);
      } else {
        console.log('Error:' + error);
        reject(error);
      }
    });
  });
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

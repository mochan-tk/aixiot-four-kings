/* eslint-disable  func-names */
/* eslint-disable  no-console */

import * as Alexa from 'ask-sdk-core';
import * as Model from 'ask-sdk-model';
import Axios from 'axios';

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
    // ここでユーザの発話をひろう
    const request  = handlerInput.requestEnvelope.request;
    const intent = (<Model.IntentRequest> request).intent;
    const speechText = intent.slots.utterance.value;
    let responsWord;

    // 機械学習のモデルと連携する想定, たぶんutf8とかの指定もいるきがする > https://www.yoheim.net/blog.php?q=20170801
    const data = { text : speechText };
    Axios.post('http://54.70.54.23:8080', data).then((response) => {
        responsWord = response.data;
        console.log('body:', response.data);
    });
    

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

    // ここでユーザに結果をかえす
    return handlerInput.responseBuilder
      .speak(speechText)
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

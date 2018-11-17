/* eslint-disable  func-names */
/* eslint-disable  no-console */

import * as Alexa from 'ask-sdk-core';
import * as Model from 'ask-sdk-model';

const LaunchRequestHandler : Alexa.RequestHandler = {
  canHandle(handlerInput : Alexa.HandlerInput) : boolean {

    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput : Alexa.HandlerInput) : Promise<Model.Response> {
    const speechText = 'やっほ！';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('こんにちは', speechText)
      .getResponse();
  },
};

const HelloWorldIntentHandler : Alexa.RequestHandler = {
  canHandle(handlerInput : Alexa.HandlerInput) : boolean {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  async handle(handlerInput : Alexa.HandlerInput) : Promise<Model.Response> {
    const speechText = 'Hello World!';

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

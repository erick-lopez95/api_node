export const sendToQueue = () => {
  return async (context) => {
    if (context.method === 'create' && context.result) {
      try {
        const queueService = context.app.service('queue')
        const conversion = context.result

        const message = {
          eventType: 'conversion_created',
          timestamp: new Date().toISOString(),
          conversionId: conversion._id ? conversion._id.toString() : null,
          data: {
            from_currency: conversion.from_currency,
            to_currency: conversion.to_currency,
            amount: conversion.amount,
            converted_amount: conversion.converted_amount,
            rate: conversion.rate,
            provider: conversion.provider,
            timestamp: conversion.timestamp || new Date().toISOString()
          }
        }

        await queueService.sendToQueue(message)
        console.log('Conversion sent to queue:', conversion._id)

      } catch (error) {
        console.error('Error sending to queue:', error)
      }
    }

    return context
  }
}
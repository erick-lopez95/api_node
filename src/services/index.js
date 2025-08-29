import { queue } from './queue/queue.js'
import { report } from './report/report.js'
import { convert } from './convert/convert.js'
import { cryptoRates } from './crypto-rates/crypto-rates.js'
import { fiatRates } from './fiat-rates/fiat-rates.js'
import { rates } from './rates/rates.js'
export const services = app => {
  app.configure(queue)

  app.configure(report)

  app.configure(convert)

  app.configure(cryptoRates)

  app.configure(fiatRates)

  app.configure(rates)

  // All services will be registered here
}

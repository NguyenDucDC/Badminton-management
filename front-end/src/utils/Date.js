import moment from 'moment'

export const formatDate = (date) => {
  return moment(date).format('ddd DD-MM-YYYY HH:mm:ss A ')
}

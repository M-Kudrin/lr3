import moment from 'moment'

moment.locale('ru');

export function humanizeTime(time) {
  if (Date.now() - time < 60*60*1000)
    return moment(time).fromNow();
  else if(new Date(time).setHours(0,0,0,0) === new Date().setHours(0,0,0,0))
    return moment(time).format('H:mm');
  else return moment(time).format('D MMMM YYYY, H:mm');
}

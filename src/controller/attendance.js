const moment = require('moment')

const response = require('../constant/response')
const db = require('../model/index')
const attendanceModel = db.attendance
const staffModel = db.staff

exports.add = async(req, res) => {
    req.body.date = moment().format('YYYY-MM-DD')
    req.body.in_time = moment().format('HH:mm:ss')
    await attendanceModel.create(req.body)
    .then((attdResult) => {
        return response(res, true, 201, 'attendence added successfully!',attdResult)
    })
    .catch((err) => {
        console.log('err ==> ',err);
        return response(res, false, 422, 'error, attendance not added!')
    })

}

// view particular staff attendance by staff_id
exports.view = async(req, res) => {
   await attendanceModel.findAll({
    where: {staff_id: req.params.staff_id},
    include: [
        {
            model: staffModel
        }
    ]
   })
   .then((staffResult) => {
    
    if(!staffResult.length){
        return response(res, false, 204, 'staff attendance does not exist')
    }else{
        const staffArr = []
        for(let i =0; i< staffResult.length; i++){
            staffArr.push({
               id: staffResult[i].id,
               date: staffResult[i].date? moment(staffResult[i].date).format(): null,
               in_time:  staffResult[i].in_time? moment(staffResult[i].in_time, 'HH:MM:ss') : null,
               out_time: staffResult[i].out_time? moment(staffResult[i].out_time, 'HH:MM:ss') : null,
               notes: staffResult[i].notes,
               status: staffResult[i].status,
               is_checkIn: staffResult[i].is_checkIn,
               time_duration: staffResult[i].time_duration? moment(staffResult[i].time_duration, 'HH:MM:ss') : null,
               staff_id: staffResult[i].staff_id,
               staff_name: staffResult[i].staff.name 
            })
        }
        return response(res, true, 200, 'staff attendance result found',  staffArr)
    }
   })
   .catch(() =>{
    return response(res, false, 422, 'staff attendance data not found')
   })
}

// add or edit staff attendance
exports.edit = async(req, res) => {
    const todaysDate = moment().format()
    const checkTodaysRecord=  await attendanceModel.findOne({
        where: { date: todaysDate, staff_id: req.currentUser.id
        }
    })
    if(checkTodaysRecord){
        const outTime = moment()
        const startTime = moment(checkTodaysRecord.in_time,'HH:mm:ss')
        const endTime = moment(outTime, 'HH:mm:ss') 
        
        const hourDifference =endTime.hours() - startTime.hours()
        const minutesDifference =Math.abs(endTime.minutes() - startTime.minutes())
       
        /* ---------------------------------------
        method-1
        const minutesDdifference = moment(outTime,'HH:mm:ss').diff(moment(startTime, 'HH:mm:ss'), 'minutes')
        const HourDifference = moment(outTime,'HH:mm:ss').diff(moment(startTime, 'HH:mm:ss'), 'hours')
        
        console.log('startTime => ',startTime);
        console.log('endTime => ',endTime);
        
        console.log('minutesDdifference => ',minutesDdifference);
        console.log('HourDifference => ',HourDifference);
        -----------------------------------------------------
        
        method-2
        const difference = moment.duration(endTime.diff(startTime))
        const hourDifference =difference.hours()
        const minDifference =difference.minutes()
        console.log('hourDifference => ',hourDifference);
        console.log('minDifference => ',minDifference);
        (not working bcoz of wrong min diff)
        -------------------------------------------- */
        
        const countHours = hourDifference < 10 ? '0' + hourDifference : hourDifference;
        const countMin = minutesDifference < 10 ? '0' + minutesDifference : minutesDifference;
      
        req.body.out_time = moment(endTime).format('HH:mm:ss')
        req.body.is_checkIn = false
        req.body.time_duration = `${countHours}:${countMin}`
        
        await attendanceModel.update(req.body,
            {
                where: {id: checkTodaysRecord.id}
            })
            .then(() => {
                return response(res, true, 201, 'checked out sucessfully',req.body.out_time)
            })
            .catch((error) => {
                
                return response(res, false, 422, 'error, you are not check-out')
            })
    }else{
        req.body.date = moment().format('YYYY-MM-DD')
        req.body.in_time = moment().format('HH:mm:ss')
        req.body.status = 'Working';
        req.body.staff_id = req.currentUser.id
        await attendanceModel.create(req.body)
        .then((attdResult) => {
            return response(res, true, 201, 'Checked-in successfully',attdResult)
        })
        .catch(() => {
            return response(res, false, 422, 'error while checking-in')
        })
    }
}

// particular date wise/currrent day attendance list of staff
exports.listByDate = async(req, res) => {
    let condition = {}
    if(req.query.date){
        condition = {
            date: req.query.date
        }
    }else{
        condition = {
            date: moment().format('YYYY-MM-DD')
        }
    }
    await attendanceModel.findAll({
        where: condition,
        include: [
            {
                model: staffModel
            }
        ]
    },
    {
        raw: true
    })
    .then(async(listResult) => { 
        if(!listResult){
            return response(res, false, 422, 'staff attendance does not exist')
        }
        
        const listArr = []
        for(let i = 0; i< listResult.length; i++){
            const obj = {
                id: listResult[i].id,
                date: listResult[i].date,
                in_time: listResult[i].in_time,
                out_time: listResult[i].out_time,
                notes: listResult[i].notes,
                status: listResult[i].status,
                is_checkIn: listResult[i].is_checkIn,
                time_duration:listResult[i].time_duration ? convertH2M(listResult[i].time_duration) + ' min' : '', 
                staff_id: listResult[i].staff_id,
                staff_name: listResult[i].staff.name
            }
            listArr.push(obj)
        }
        return response(res, true, 200, 'staff attendance list',listArr)
    })
    .catch((err) => {
        console.log('err => ',err);
        return response(res, false, 422, 'staff attendance list not found')
    })
}

// current day loged-in staff attendance list
exports.myAttendanceList = async(req, res) => {
    await attendanceModel.findAll({
        where: {staff_id: req.currentUser.id, date: moment().format('YYYY-MM-DD') }
    })
    .then((staffData) => {
        if(!staffData.length){
            return response(res, false, 204, 'staff data does not exist')
        }else{
            for(let i = 0; i < staffData.length; i++){
                 staffData[i].time_duration = staffData[i].time_duration? convertH2M(staffData[i].time_duration) + ' min' : null
            }
            return response(res, true, 200, 'staff data found', staffData)
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'staff data not found')
    })
}







function convertH2M(hours){
    const timeParts = hours.split(':')
    return Number(timeParts[0] * 60) + Number(timeParts[1])
}
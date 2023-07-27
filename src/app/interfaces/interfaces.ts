export interface  IWeeklyData {
    emp_id:number,
    emp_name:string,
    staff_no: string,
    week_number: number,
    year: string,
    days:Array<string>,
    enableSaveSubmit: boolean,
    active_projects:Array<IActiveProjects>,
    VACATION:{
        work_hours:Array<IWorkHours>
    },
    MISCELLANEOUS:{
        work_hours:Array<IWorkHours>
    },
    HOLIDAY:{
        work_hours:Array<IWorkHours>
    },
    gross_working_hours:Array<IWorkHours>,
    net_working_hours:Array<IWorkHours>,
    attendance_flag: boolean
}

export interface IActiveProjects{
    project_name:string,
    project_id:number,
    priority:number,  
    cumulative:ICumulative,
    work_hours:Array<IWorkHours>,
    visibilityFlag:boolean
}

export interface  IWorkHours {
    date:string,
    h:number,
    m:number,
    enable:boolean
}

export interface  ICumulative {
    h:number,
    m:number
}

export interface IWeeklyStatus{
    emp_id:number,
    emp_name:string,
    staff_no: string,
    week_number:number,
    active_projects:Array<IWeeklyStatusProjects>,
    GENERAL:IWeeklyStatusProjects
}

export interface IWeeklyStatusProjects{
    project_name:string,
    project_id: number,
    priority: number,
    work_report: string,
    visibilityFlag: boolean
}

export interface IAttendance{
    success:boolean,
    message:string,
    results:Array<IAttendanceResults>
}

export interface IAttendanceResults{
    emp_name: string,
    staff_no: string,
    emp_id: string,
    Date: string,
    FirstInTime: string,
    LastOutTime: string,
    GrossWorkingHours: string,
    NetWorkingHours: string,
    WeekdayFlag: boolean,
    punchdata: Array<IPunchdata>,
    timesheet_total_working_hours: string,
    vacation_hours: string,
    holiday_hours: string,
    project_hours: string,
    HolidayFlag: boolean,
    device_id: number,
    alternative_id: number
}

export interface IPunchdata{
    In:string,
    Out:string,
    Net:string
}

export interface IManagerReporters{
    success:boolean,
    message:string,
    results:Array<IManagerReportersResults>
}

export interface IManagerReportersResults{
    emp_id: number,
    email: string,
    emp_name: string,
    staff_no: string,
    role: number,
    status: string,
    reporters: Array<IManagerReportersList>
}

export interface IManagerReportersList{
    emp_id: number,
    emp_name: string,
    email: string,
    staff_no: string,
    role: number
}
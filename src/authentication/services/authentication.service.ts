export const findTimeDifference = (time:any) => {
    const given_time:any = new Date(time)

    const now:any = new Date()

    const difference_in_milliseconds:number = now - given_time

    const difference_in_minutes:number = Math.floor(difference_in_milliseconds / 1000 / 60)

    return Number(difference_in_minutes);
}
const addHours = (date: Date, hours: number): Date => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  };
  function addDays(date : Date, days : number) {
          var result = new Date(date);
          result.setDate(result.getDate() + days);
          return result;
  };
  
  
  class Segment {
     departureDate : Date;
     arrivalDate: Date;
  
     constructor(a:Date,e:Date){
      this.arrivalDate = a;
      this.departureDate = e;
     }
  }
  
  class Flight{
   segments: Segment[] = [];
  
   constructor(segments: Segment[]){
      this.segments= segments;
   }
  }
  
  
  
  class FlightBuilder{
  
      threeDaysFromNow : Date;
  
      constructor(){
          var current = new Date();
          this.threeDaysFromNow = addDays(current,3);
      }
  
      static createFlight(dates: Date[]){
          var departureDates = dates.filter((date, index) => index % 2 == 0);
          var arrivalDates = dates.filter((date, index) => index % 2 == 1);
  
         
          var segments = [];
          for(var i = 0; i< departureDates.length ;i++){
              
              segments.push(new Segment(arrivalDates[i],departureDates[i]));
          }
  
  
              return new Flight(segments);
      }
  
      getFlights(){
          var flights =[];        
          //A normal flight with two hour duration
          flights.push(FlightBuilder.createFlight([this.threeDaysFromNow, addHours(this.threeDaysFromNow,2)]));
  
          //A normal multi segment flight
          flights.push(FlightBuilder.createFlight([this.threeDaysFromNow, addHours(this.threeDaysFromNow,2),addHours(this.threeDaysFromNow,3), addHours(this.threeDaysFromNow,5)]));
                             
          //A flight departing in the past
          flights.push(FlightBuilder.createFlight([addDays(this.threeDaysFromNow,-6),this.threeDaysFromNow]));
  
          //A flight that departs before it arrives                           
          flights.push(FlightBuilder.createFlight([this.threeDaysFromNow,addHours(this.threeDaysFromNow,-6)]));
  
          //A flight with more than two hours ground time                          
          flights.push(FlightBuilder.createFlight([this.threeDaysFromNow, addHours(this.threeDaysFromNow,2),addHours(this.threeDaysFromNow,5), addHours(this.threeDaysFromNow,6)]));
                             
          //Another flight with more than two hours ground time                         
          flights.push(FlightBuilder.createFlight([this.threeDaysFromNow, addHours(this.threeDaysFromNow,2),addHours(this.threeDaysFromNow,3), addHours(this.threeDaysFromNow,4),addHours(this.threeDaysFromNow,6), addHours(this.threeDaysFromNow,7) ]));
                             
          return flights;
      }
  }

const segmentWithArrivalDateBeforeDepartureDateTimeFilter = (flight: Flight) => {
    const segments: Segment[] = flight.segments;
    const numberOFSegments: number = segments.length
    if (numberOFSegments === 1) return false;

    let arrivalAfterDeparture: boolean = false;
    for (let i = 0; i < numberOFSegments-1; i++) {
        let firstArrival = new Date(segments[i].arrivalDate).getTime();
        let nextDeparture = new Date(segments[i+1].departureDate).getTime();
        arrivalAfterDeparture = firstArrival < nextDeparture
    }
    return arrivalAfterDeparture;
}

const spendMoreThan2HoursOnTheGroundFilter = (flight: Flight) => {
    const segments: Segment[] = flight.segments;
    const numberOFSegments: number = segments.length
    if (numberOFSegments === 1) return false;

    let arrivalAfterDeparture: boolean = false;
    for (let i = 0; i < numberOFSegments-1; i++) {
        const arrival = new Date(segments[i].arrivalDate);
        const nextDeparture = new Date(segments[i+1].departureDate);

        const diff = nextDeparture.valueOf() - arrival.valueOf();
        const diffInHours = diff/1000/60/60; // Convert milliseconds to hours         

        return diffInHours > 2;
    }
    return arrivalAfterDeparture;
}

const departureBeforeCurrentDateTimeFilter = (flight: Flight) => {
    const segments: Segment[] = flight.segments;

    const currentDate = new Date();
    const firstDeparture = new Date(segments[0].departureDate)

    return currentDate.getTime() > firstDeparture.getTime();
}

type FilterType = (flight: Flight) => boolean;
  
// var fb = new FlightBuilder();
// var flights = fb.getFlights()

  class FlightBuilderWithFilters extends FlightBuilder {
    private setFilter: FilterType | null = null;

    public getFlights() {
        let flights = super.getFlights()

        if (this.setFilter) {
            flights = flights.filter(this.setFilter)
        }

        return flights;
    }

    public addFilter(valueFilter: FilterType) {
        this.setFilter = valueFilter
    }

    public removeFilter() {
        this.setFilter = null;
    }
  }

  /*
  Invoke the GetFlights method and given the flights returned from the FlightBuilder class filter out those that:
  
  1. Depart before the current date/time.
  2. Have a segment with an arrival date before the departure date.
  3. Spend more than 2 hours on the ground. i.e those with a total gap of over two hours between the arrival
  date of one segment and the departure date of the next.
  
  
  Include as much or as little as you deem appropriate.
  As a starting point it is highly likely we will want to adjust, add to or remove from these rules.
  
  */
  console.log("Go")


var fb = new FlightBuilderWithFilters();

fb.addFilter(segmentWithArrivalDateBeforeDepartureDateTimeFilter)
var flights = fb.getFlights()
console.log('segmentWithArrivalDateBeforeDepartureDateTimeFilter', flights)

fb.removeFilter()

fb.addFilter(spendMoreThan2HoursOnTheGroundFilter)
var flights = fb.getFlights()
console.log('spendMoreThan2HoursOnTheGroundFilter', flights)

fb.removeFilter()

fb.addFilter(departureBeforeCurrentDateTimeFilter)
var flights = fb.getFlights()
console.log('departureBeforeCurrentDateTimeFilter', flights)


// console.log(flights)
  
  
  
  
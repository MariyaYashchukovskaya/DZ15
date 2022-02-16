function fetchDataPromise(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, url)

        xhr.onload = () => {
            if (xhr.status == '200') {
                resolve(xhr.response)
            } else {
                reject(xhr.status + ' ' + xhr.statusText)
            }
        }

        xhr.onerror = () => {
            reject(xhr.status + ' ' + xhr.statusText)
        }

        xhr.send()
    })
}


class Weather {
    key = '1354067d4c5e5ba7d6625f68d153937b'
    urlWetherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${this.key}`
    urlWetherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${this.key}`

    constructor() {

        this.currentWeatherHtmlElement = document.querySelector('.weather__current')
        this.daysWeatherHtmlElement = document.querySelector('.weather__days')
        this.init()
    }

    init() {
        this.initializationThenOne()
        this.initializationThenTwo()

    }

    transformDirectionWind(windDeg) {
        let windDirection = ''
        if (windDeg == 360 || windDeg == 0) {
            windDirection = 'North'
        }
        else if (0 < windDeg && windDeg < 90) {
            windDirection = 'Northeast'
        }
        else if (windDeg == 90) {
            windDirection = 'East'
        }
        else if (90 < windDeg && windDeg < 180) {
            windDirection = 'Southeast'
        }
        else if (windDeg == 180) {
            windDirection = 'South'
        }
        else if (180 < windDeg && windDeg < 270) {
            windDirection = 'Southwest'
        }
        else if (windDeg == 270) {
            windDirection = 'West'
        }
        else if (270 < windDeg && windDeg < 360) {
            windDirection = 'Northwest'
        }
        return windDirection
    }

    transformTime(time) {
        return time < 10 ? `0${time}` : time
    }


    initializationThenOne() {
        fetchDataPromise(this.urlWetherCurrent)
            .then((response) => {
                const data = JSON.parse(response)

                const city = data.name
                const windDeg = data.wind.deg
                console.log(windDeg)
                const windDirection = this.transformDirectionWind(windDeg)
                console.log(windDirection)
                const windSpeed = Math.round(data.wind.speed) + 'm/s'
                console.log(windSpeed)
                const date = new Date(data.dt * 1000)
                const time = `${this.transformTime(date.getHours())}:${this.transformTime(date.getMinutes())} `
                const temp = Math.round(data.main.temp - 273.15) + '°C'
                const countryCode = data.sys.country
                const description = data.weather[0].description
                const iconSrc = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                console.log(data)
                let result = ""

                let template = this.templateCurrentWeather(city, windDirection, windSpeed, time, temp, countryCode, description, iconSrc)
                result = result + template
                this.currentWeatherHtmlElement.innerHTML = result

            })
            .catch((error) => {
                console.error(error)
            })
    }

    templateCurrentWeather(city, windDirection, windSpeed, time, temp, countryCode, description, iconSrc) {
        return `
        <span>${city}, ${countryCode}</span>
        <span><i class="far fa-clock"></i> ${time}</span>
        <img class="weather__current_icon" src="${iconSrc}">
        <span class="weather__current_description">${description}</span>
        <span class="weather__current_temp">${temp}</span>
        <div class="weather__current_wind">
            <span><i class="fas fa-wind"></i>${windDirection}, ${windSpeed}</span>        
        </div>         
        `
    }

    initializationThenTwo() {
        fetchDataPromise(this.urlWetherByDays)
            .then((response) => {
                const data = JSON.parse(response)
                let result = ""
                data.list.forEach((item, index) => {
                    if ((index + 5) % 8 == 0) {

                        let template = this.templateWeatherByDays(item)
                        result = result + template
                    }
                })
                this.daysWeatherHtmlElement.innerHTML = result
            })

            .catch((error) => {
                console.error(error)
            })
    }

    transformWeekDay(date) {
        const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const dateDay = date.getDay()
        const weekDay = day[dateDay]
        return weekDay
    }

    transformMonth(date) {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        const dateMonth = date.getMonth()
        const monthNow = month[dateMonth]
        return monthNow
    }

    templateWeatherByDays(item) {
        const date = new Date(item.dt * 1000)
        const weekDay = this.transformWeekDay(date)
        const monthNow = this.transformMonth(date)
        const day = date.getDate()
        const time = `${this.transformTime(date.getHours())}:${this.transformTime(date.getMinutes())} `
        const temp = Math.round(item.main.temp - 273.15) + '°C'
        const iconSrc = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        return `
        <div class="weather__day">
            <span>
            ${day}
            ${monthNow}
            ${weekDay}
            ${time}
            </span>            
            <img class="weather__icon" src="${iconSrc}">
            <span>${temp}</span>
        </div>       
            `
    }
}

let weather = new Weather()
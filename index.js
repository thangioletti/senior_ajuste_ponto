"use strict"

window.onload = function () {
    let elements = document.getElementsByClassName('totalizer-text-value');
    const saidaPrevista = elements[0];
    const tempoRestante = elements[1];
    const trabalhando = elements[2];
    const intervalos = elements[3];
    const extras = elements[4];
    const faltas = elements[5];

    //Horas extras 
    let extra = [...document.getElementsByClassName('title-overtime-highlight')].filter(e => e.innerHTML != 'Hora-Extra').map(e => e.innerHTML);
    let work = [...document.getElementsByClassName('title-working-highlight')].filter(e => e.innerHTML != 'Trabalhando').map(e => e.innerHTML);
    let hours = [...extra, ...work].sort().map((e, i) => {
        let splitted = e.split(' às ');
        return {
            begin: `${splitted[0]}:00`,
            end: `${splitted[1]}:00`
        }
    });

    for (let i = 0; i < hours.length; i++) {
        const hour = hours[i];
        let nextHour = null;
        const next = i + 1;
        if (hours.length > next) {
            nextHour = hours[next];
        }

        if (nextHour) {
            if (nextHour.begin == hour.end) {
                hours[i] = {
                    begin: hour.begin,
                    end: nextHour.end
                };
                hours.splice(next, 1);
            }
        }
    }


    function timestrToSec(timestr) {
        var parts = timestr.split(":");
        return (parts[0] * 3600) +
            (parts[1] * 60) +
            (+parts[2]);
    }

    function pad(num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return "" + num;
        }
    }

    function formatTime(seconds) {
        return [pad(Math.floor(seconds / 3600)),
        pad(Math.floor(seconds / 60) % 60),
        pad(seconds % 60),
        ].join(":");
    }

    for (let hour of hours) {
        hour.time = formatTime(timestrToSec(hour.end) - timestrToSec(hour.begin));
    }

    let sum = '00:00:00';
    for (let i = 0; i < hours.length - 1; i++) {
        const hour = hours[i];
        sum = formatTime(timestrToSec(sum) + timestrToSec(hour.time));
    }

    let dif = formatTime(timestrToSec("08:00:00") - timestrToSec(sum));    
    let timeOfHappiness = formatTime(timestrToSec(hours[hours.length - 1].begin) + timestrToSec(dif));
    let remainingTime = formatTime(timestrToSec(dif) - timestrToSec(hours[hours.length - 1].time));
    trabalhando.innerHTML = formatTime(timestrToSec(sum) + timestrToSec(hours[hours.length - 1].time));;
    tempoRestante.innerHTML = remainingTime;
    saidaPrevista.innerHTML = timeOfHappiness;
    document.getElementsByClassName('hour-dashboard-col-right')[0].style.display = 'none';
    [...document.getElementsByTagName('totalizer')].forEach((e, i) => {
        if (i > 2) {
            e.style.display = 'none';
        }
    })
}

"use strict"

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

function createCard(title, value) {
    let card = document.createElement('div');
        card.style.textAlign = 'center';
        card.style.marginLeft = '-1px';
        card.style.padding = '10px';
        card.style.paddingTop = '15px';        
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.height = '80px';
    let h1Title = document.createElement('span');
        h1Title.innerHTML = title;
        h1Title.style.fontSize = '14px';
    card.appendChild(h1Title);
    
    let h1Value = document.createElement('span');
        h1Value.innerHTML = value;
        h1Value.style.fontSize = '18px';
        card.appendChild(h1Value);        

    return card;
}
window.onload = function () {
    setTimeout(() => {
        let a = [...document.getElementsByTagName('a')];
        a = a.filter(e => e.className == 'ng-scope ng-isolate-scope');
        a = a[0];
        let data = [...a.getElementsByTagName('span')];
        data = data.map(e => e.innerHTML)

        const hours = [];
        for (let i = 0; i < data.length; i++) {
            console.log(i)
            const current = data[i];
            const next = i + 1;
            let hourObj = {
                begin: `${current.trim()}:00`
            }
            if (data.length > next) {
                hourObj.end = `${data[next].trim()}:00`;
                i++;
            } else {
                const d = new Date();                
                hourObj.end = `${d.getHours()}:${d.getMinutes()}:00`;
            }
            
            hourObj.time = formatTime(timestrToSec(hourObj.end) - timestrToSec(hourObj.begin));   
            hours.push(hourObj);
        }

        let sum = '00:00:00';
        for (let i = 0; i < hours.length - 1; i++) {
            const hour = hours[i];
            sum = formatTime(timestrToSec(sum) + timestrToSec(hour.time));
        }
    
        let dif = formatTime(timestrToSec("08:00:00") - timestrToSec(sum));    
        let timeOfHappiness = formatTime(timestrToSec(hours[hours.length - 1].begin) + timestrToSec(dif));
        let remainingTime = formatTime(timestrToSec(dif) - timestrToSec(hours[hours.length - 1].time));
        let worked = formatTime(timestrToSec(sum) + timestrToSec(hours[hours.length - 1].time));    
        let extra = '00:00:00';
        let interval = formatTime(timestrToSec(hours[hours.length - 1].end) - timestrToSec(hours[0].begin) - timestrToSec(worked));
        

        let divContainer = document.createElement("div");        
        divContainer.style.color = "#FFFFFF";
        divContainer.style.position = "fixed";
        divContainer.style.right = "25%";        
        divContainer.style.top = "0";
        divContainer.style.zIndex = 100000000000000000;
        divContainer.style.display = "flex";
        

        
        divContainer.appendChild(createCard('Trabalhado', worked));
        divContainer.appendChild(createCard('Intervalo', interval));        
        if (timestrToSec(worked) > timestrToSec('08:00:00')) {
            extra = formatTime(timestrToSec(worked) - timestrToSec('08:00:00'));    
            divContainer.appendChild(createCard('Hora Extra', extra));
        } else {        
            divContainer.appendChild(createCard('Hora de Saida', timeOfHappiness));
            divContainer.appendChild(createCard('Tempo Restante', remainingTime));
        }
        
        
        document.body.appendChild(divContainer);
        
    }, 1000)
}
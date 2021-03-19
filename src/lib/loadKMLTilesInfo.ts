export function loadKmlTiles(kmlUrl: string): Promise<{ resourcesUrl: string, orthoRect: Cesium.Rectangle }> {
    let resourcesUrl = kmlUrl.substr(0, kmlUrl.lastIndexOf("/"));
    return new Promise((resolve, reject) => {
        fetch(kmlUrl).then(res => res.text()).then(data => {
            const north = data.indexOf('<north>')      //北
            const north2 = data.indexOf('</north>')
            const north1 = data.lastIndexOf('<north>')
            const north12 = data.lastIndexOf('</north>')
            const south = data.indexOf('<south>')      //南
            const south2 = data.indexOf('</south>')
            const south1 = data.lastIndexOf('<south>')
            const south12 = data.lastIndexOf('</south>')
            const east = data.indexOf('<east>')      //东
            const east2 = data.indexOf('</east>')
            const east1 = data.lastIndexOf('<east>')
            const east12 = data.lastIndexOf('</east>')
            const west = data.indexOf('<west>')      //西
            const west2 = data.indexOf('</west>')
            const west1 = data.lastIndexOf('<west>')
            const west12 = data.lastIndexOf('</west>')

            const northNum = Number(data.slice(north + 7, north2))
            const northNum1 = Number(data.slice(north1 + 7, north12))
            const southNum = Number(data.slice(south + 7, south2))
            const southNum1 = Number(data.slice(south1 + 7, south12))
            const eastNum = Number(data.slice(east + 6, east2))
            const eastNum1 = Number(data.slice(east1 + 6, east12))
            const westNum = Number(data.slice(west + 6, west2))
            const westNum1 = Number(data.slice(west1 + 6, west12))

            const bound = [[Math.min(westNum, westNum1), Math.min(southNum, southNum1)], [Math.max(eastNum, eastNum1), Math.max(northNum, northNum1)]]   //[[西, 南],[东, 北]]
            const orthoRect = new Cesium.Rectangle(
                Cesium.Math.toRadians(bound[0][0]),
                Cesium.Math.toRadians(bound[0][1]),
                Cesium.Math.toRadians(bound[1][0]),
                Cesium.Math.toRadians(bound[1][1]));
            resolve({ resourcesUrl, orthoRect });
        });
    })
};
export class _URL {
    static getParamVal(parametrName){
        let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parametrName) result = decodeURIComponent(tmp[1]);
        });
    return result;
    }
}
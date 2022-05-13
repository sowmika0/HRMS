import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable()
export class ObjectToUrlService {
    params = '';

    constructor() { }

    public buildParametersFromSearch<T>(obj: T): string {
        this.params = '';
        if (obj == null) {
            return this.params;
        }

        this.populateSearchParams('', obj);
        this.params = this.params.substr(1);
        return encodeURI(this.params);
    }

    private populateArray<T>(prefix: string, val: Array<T>) {
        for (let index in val) {
            let key = prefix;
            let value: any = val[index];
            this.populateSearchParams(key, value);
        }
    }

    private populateObject<T>(prefix: string, val: T) {
        const objectKeys = Object.keys(val) as Array<keyof T>;

        if (prefix) {
            prefix = prefix + '.';
        }

        for (let objKey of objectKeys) {
            let value = val[objKey];
            let key = prefix + objKey;

            this.populateSearchParams(key, value);
        }
    }

    private populateSearchParams<T>(key: string, value: any) {
        if (value !== undefined && value !== null && value !== '') {
            if (value instanceof Array) {
                this.populateArray(key, value);
            }
            else if (value instanceof Date) {
                this.params += '&' + key + '=' + value.toISOString();
            }
            else if (value instanceof Object) {
                this.populateObject(key, value);
            }
            else {
                this.params += '&' + key + '=' + value.toString();
            }
        }
    }

    getParametersFromObject(paramsObject: any[]) {
        let parameters = '';
        Object.entries(paramsObject).map(([key, val]) => {
            if (val !== undefined && val !== null) {
                if (val.constructor === Array) {
                    if (val.length > 0) {
                        val.map(arr => {
                            if (arr.constructor === Object) {
                                this.getParametersFromObject(arr);
                            }
                            parameters += `${key}=${arr}&`;
                        });
                    }
                } else {
                    parameters += `${key}=${val}&`;
                }
            }
        });
        parameters = parameters.substr(0, parameters.length - 1);
        return parameters;
    }

    convertQueryParamsToObject(filterObject: any, queryParams: Params) {
        Object.entries(filterObject).map(([key, val]) => {
            if (val === null) {
                if (queryParams[key] === undefined) {
                    val = null;
                } else {
                    val = queryParams[key];
                }
            } else {
                const isArray = val.constructor === Array;
                if (isArray) {
                    let tempArray = [];
                    const tempQueryParam =
                        queryParams[key] === undefined ? [] : queryParams[key];

                    // If the parameter is array and an array of values exists
                    if (tempQueryParam.constructor === Array) {
                        tempArray = tempQueryParam.map(value => value);
                    } else {
                        tempArray.push(tempQueryParam);
                    }
                    val = tempArray;
                } else if (typeof val === 'boolean') {
                    val = queryParams[key] === undefined ? null : queryParams[key];
                } else if (typeof val === 'number') {
                    val = queryParams[key] === undefined ? null : queryParams[key];
                } else if (typeof val === 'string') {
                    val = queryParams[key] === undefined ? '' : queryParams[key];
                }
            }
            filterObject[key] = val;
        });

        return filterObject;
    }

    objectToFormData(model, form, namespace?) {
        const formData = form || new FormData();

        if (typeof model === 'string' || typeof model === 'boolean' || typeof model === 'number') {
            formData.append(namespace, model);
        } else {
            for (const propertyName in model) {
                if (!model.hasOwnProperty(propertyName) || !model[propertyName]) {
                    continue;
                }
                const formKey = namespace
                    ? `${namespace}[${propertyName}]`
                    : propertyName;
                if (model[propertyName] instanceof Date) {
                    formData.append(formKey, model[propertyName].toISOString());
                } else if (model[propertyName] instanceof Array) {
                    model[propertyName].forEach((element, index) => {
                        const tempFormKey = `${formKey}[${index}]`;
                        this.objectToFormData(element, formData, tempFormKey);
                    });
                } else if (
                    typeof model[propertyName] === 'object' &&
                    !(model[propertyName] instanceof File)
                ) {
                    this.objectToFormData(model[propertyName], formData, formKey);
                } else {
                    formData.append(formKey, model[propertyName].toString());
                }
            }
        }
        return formData;
    }

    convertQueryStringToObject(string: string) {
        return JSON.parse('{"' + decodeURI(string).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    }
}

import { Property, Properties } from '../../../@cliter';
import * as handlebars from 'handlebars';
import * as _ from 'lodash';

handlebars.registerHelper('isI18NDataLangProperty', function(property: Property, properties: Properties)
{
    return properties.hasI18n && property.name === 'dataLang';
});

'use strict';

const dayjs = require('dayjs');

// Fuction to verify whether page publication date is valid
exports.isCorrectPublicationDate = (publication_date) => {
    if (publication_date != '' && dayjs(publication_date).diff(dayjs(), 'day') < 0) {
        throw new Error('Invalid publication date'); // Invalid date
    } else {
        return true; // Valid date
    }
}

// Function to verify whether page's content is valid
exports.isCorrectContent = (content) => {
    let error = false;
    let types_component = ['header', 'paragraph', 'image'];
    let prec_id = -1;
    let one_header = 0;
    let one_other_component = 0;

    content.forEach((c) => {
        // Check for invalid component's field value
        if (!Number.isInteger(parseInt(c.pos)) || c.type == '' || c.value == '') {
            error = true;
            throw new Error('Invalid page content');  // Invalid content
        }

        // Check for incorrect sequence of pos
        if (c.pos - 1 != prec_id) {
            error = true;
            throw new Error('Invalid page content');  // Invalid content
        }
        prec_id++;

        // Check for incorrect type
        {
            error = true;
            types_component.forEach((t) => {
                if (c.type === t) {
                    error = false;
                    return;
                }
            })

            if (error == true) {
                throw new Error('Invalid page content');  // Invalid content
            }
        }

        // Check minimum number of component per type
        if (c.type == 'header') {
            one_header++;
        } else if (c.type == 'paragraph' || c.type == 'image') {
            one_other_component++;
        }
    });

    if (error == true || (one_header < 1 || one_other_component < 1)) {
        throw new Error('Invalid page content');  // Invalid content
    }

    return true; // Valid content
}
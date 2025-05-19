import ResponseTrait from '../traits/ResponseTrait.js';

class RoadmapRequest {
    static validateCreate(req, res, next) {
        const { title, description, icon, color, estimatedTime, difficulty, topics } = req.body;

        const errors = {};

        if (!title) errors.title = "Title is required";
        if (!description) errors.description = "Description is required";
        if (!icon) errors.icon = "Icon is required";
        if (!color) errors.color = "Color is required";
        if (!estimatedTime) errors.estimatedTime = "Estimated time is required";
        if (!difficulty) errors.difficulty = "Difficulty is required";
        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            errors.topics = "At least one topic is required";
        } else {
            topics.forEach((topic, index) => {
                if (!topic.name) {
                    errors[`topics.${index}.name`] = "Topic name is required";
                }
                if (!topic.status) {
                    errors[`topics.${index}.status`] = "Topic status is required";
                } else if (!["pending", "in-progress", "completed"].includes(topic.status)) {
                    errors[`topics.${index}.status`] = "Invalid status. Must be one of: pending, in-progress, completed";
                }
                if (topic.resources && Array.isArray(topic.resources)) {
                    topic.resources.forEach((resource, rIndex) => {
                        if (!resource.name) {
                            errors[`topics.${index}.resources.${rIndex}.name`] = "Resource name is required";
                        }
                        if (!resource.url) {
                            errors[`topics.${index}.resources.${rIndex}.url`] = "Resource URL is required";
                        }
                    });
                }
            });
        }

        if (Object.keys(errors).length > 0) {
            return ResponseTrait.validationError(res, errors);
        }

        next();
    }

    static validateUpdate(req, res, next) {
        const { title, description, icon, color, estimatedTime, difficulty, topics } = req.body;

        const errors = {};

        if (title === undefined) errors.title = "Title is required";
        if (description === undefined) errors.description = "Description is required";
        if (icon === undefined) errors.icon = "Icon is required";
        if (color === undefined) errors.color = "Color is required";
        if (estimatedTime === undefined) errors.estimatedTime = "Estimated time is required";
        if (difficulty === undefined) errors.difficulty = "Difficulty is required";
        if (topics === undefined || !Array.isArray(topics) || topics.length === 0) {
            errors.topics = "At least one topic is required";
        } else {
            topics.forEach((topic, index) => {
                if (!topic.name) {
                    errors[`topics.${index}.name`] = "Topic name is required";
                }
                if (!topic.status) {
                    errors[`topics.${index}.status`] = "Topic status is required";
                } else if (!["pending", "in-progress", "completed"].includes(topic.status)) {
                    errors[`topics.${index}.status`] = "Invalid status. Must be one of: pending, in-progress, completed";
                }
                if (topic.resources && Array.isArray(topic.resources)) {
                    topic.resources.forEach((resource, rIndex) => {
                        if (!resource.name) {
                            errors[`topics.${index}.resources.${rIndex}.name`] = "Resource name is required";
                        }
                        if (!resource.url) {
                            errors[`topics.${index}.resources.${rIndex}.url`] = "Resource URL is required";
                        }
                    });
                }
            });
        }

        if (Object.keys(errors).length > 0) {
            return ResponseTrait.validationError(res, errors);
        }

        next();
    }

    static validateTopicStatus(req, res, next) {
        const { status } = req.body;
        const errors = {};

        if (!status) {
            errors.status = "Status is required";
        } else if (!["pending", "in-progress", "completed"].includes(status)) {
            errors.status = "Invalid status. Must be one of: pending, in-progress, completed";
        }

        if (Object.keys(errors).length > 0) {
            return ResponseTrait.validationError(res, errors);
        }

        next();
    }

    static validateGetAll(req, res, next) {
        const { page, limit, search, sort, filter } = req.query;
        const errors = {};

        // Validate pagination
        if (page && (isNaN(page) || page < 1)) {
            errors.page = "Page must be a positive number";
        }
        if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
            errors.limit = "Limit must be a number between 1 and 100";
        }

        // Validate sort
        if (sort) {
            const validSortFields = ['title', 'createdAt', 'updatedAt', 'progress', 'difficulty'];
            const [field, order] = sort.split(':');
            if (!validSortFields.includes(field)) {
                errors.sort = `Sort field must be one of: ${validSortFields.join(', ')}`;
            }
            if (order && !['asc', 'desc'].includes(order.toLowerCase())) {
                errors.sort = "Sort order must be either 'asc' or 'desc'";
            }
        }

        // Validate filter
        if (filter) {
            try {
                const filterObj = JSON.parse(filter);
                const validFilterFields = ['difficulty', 'status', 'isTemplate'];
                const invalidFields = Object.keys(filterObj).filter(field => !validFilterFields.includes(field));
                if (invalidFields.length > 0) {
                    errors.filter = `Invalid filter fields: ${invalidFields.join(', ')}`;
                }
            } catch (e) {
                errors.filter = "Invalid filter format. Must be a valid JSON string";
            }
        }

        if (Object.keys(errors).length > 0) {
            return ResponseTrait.validationError(res, errors);
        }

        next();
    }

    static validateGetById(req, res, next) {
        const { id } = req.params;
        const errors = {};

        if (!id) {
            errors.id = "Roadmap ID is required";
        } else if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
            errors.id = "Invalid roadmap ID format";
        }

        if (Object.keys(errors).length > 0) {
            return ResponseTrait.validationError(res, errors);
        }

        next();
    }

    static validateDelete(req, res, next) {
        const { id } = req.params;
        const errors = {};

        if (!id) {
            errors.id = "Roadmap ID is required";
        } else if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
            errors.id = "Invalid roadmap ID format";
        }

        if (Object.keys(errors).length > 0) {
            return ResponseTrait.validationError(res, errors);
        }

        next();
    }
}

export default RoadmapRequest; 
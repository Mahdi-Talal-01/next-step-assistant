const ResponseTrait = require("../traits/ResponseTrait");
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
}
module.exports = RoadmapRequest; 
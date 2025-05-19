class ProfileRequest {
  static validate(req) {
    const { bio, location, phone, linkedin, github, website } = req.body;
    const errors = {};

    if (bio && bio.length > 500) {
      errors.bio = 'Bio must not exceed 500 characters';
    }

    if (location && location.length > 100) {
      errors.location = 'Location must not exceed 100 characters';
    }

    if (phone && !this.isValidPhone(phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (linkedin && !this.isValidUrl(linkedin)) {
      errors.linkedin = 'Invalid LinkedIn URL';
    }

    if (github && !this.isValidUrl(github)) {
      errors.github = 'Invalid GitHub URL';
    }

    if (website && !this.isValidUrl(website)) {
      errors.website = 'Invalid website URL';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }

  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export default ProfileRequest; 
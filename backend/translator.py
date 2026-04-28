import argostranslate.translate

def translate_text(text, from_lang, to_lang):
    installed_languages = argostranslate.translate.get_installed_languages()

    # Convert list → dict
    lang_map = {lang.code: lang for lang in installed_languages}

    from_language = lang_map.get(from_lang)
    to_language = lang_map.get(to_lang)

    if not from_language or not to_language:
        raise ValueError(f"Language not installed: {from_lang} → {to_lang}")

    translation = from_language.get_translation(to_language)

    if translation is None:
        raise ValueError(f"No model for: {from_lang} → {to_lang}")

    return translation.translate(text)
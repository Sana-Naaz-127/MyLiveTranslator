import argostranslate.package
import argostranslate.translate

print("Updating package index...")
argostranslate.package.update_package_index()
available_packages = argostranslate.package.get_available_packages()

language_pairs = [
    ("en", "hi"), ("hi", "en"),
    ("en", "fr"), ("fr", "en"),
    ("en", "es"), ("es", "en"),
]

for from_code, to_code in language_pairs:
    try:
        package = next(
            filter(
                lambda x: x.from_code == from_code and x.to_code == to_code,
                available_packages
            )
        )
        print(f"Installing {from_code} → {to_code}...")
        argostranslate.package.install_from_path(package.download())
        print(f"Done")
    except StopIteration:
        print(f"Not found: {from_code} → {to_code}")
    except Exception as e:
        print(f"Error installing {from_code} → {to_code}: {e}")

print("\nAll models processed.")
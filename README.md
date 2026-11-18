# StudySpot

StudySpot to projekt z przedmiotu **Aplikacje internetowe**. Katalog pomaga studentom znaleźć miejsce do samodzielnej nauki lub pracy grupowej w Krakowie według dzielnicy i dostępnych udogodnień.

![Widok strony głównej StudySpot z wyszukiwarką i trzema kartami miejsc](docs/podglad.webp)

## Zakres pierwszego etapu

Działa prototyp z trzema przykładowymi miejscami. Można przeszukiwać katalog po nazwie, dzielnicy lub udogodnieniu, zawężać wyniki według rodzaju miejsca, czytać szczegóły i zapisywać miejsca na później. Zapisane miejsca są dostępne po odświeżeniu strony w tej samej przeglądarce. Interfejs jest responsywny i dostępny po polsku. Miejsca są fikcyjne, a zdjęcia mają charakter ilustracyjny.

Zrealizowano dwa z pięciu zaplanowanych etapów, czyli około **40% zakresu projektu**.

| Etap | Stan |
| --- | --- |
| Responsywny katalog i dane demonstracyjne | Gotowy |
| Wyszukiwanie, filtry, szczegóły i lokalnie zapisane miejsca | Gotowy |
| API katalogu i baza danych | W planie |
| Konta użytkowników i synchronizacja zapisanych miejsc | W planie |
| Formularze zgłaszania miejsc i dodawania opinii | W planie |

## Technologie

| Warstwa | Technologia | Rola |
| --- | --- | --- |
| Interfejs | React, TypeScript, CSS | Komponenty, model miejsca i układ responsywny |
| Uruchamianie i kompilacja | Vite | Serwer deweloperski i kompilacja produkcyjna |
| Dane prototypu | TypeScript i localStorage | Katalog demonstracyjny i zapis identyfikatorów ulubionych miejsc |
| Kolejny etap | Java, Spring Boot, PostgreSQL | API REST, baza oraz dane przypisane do konta |

## Uruchomienie

Do lokalnego uruchomienia potrzebne są Node.js (co najmniej 22.12 z linii 22 LTS lub nowsza wspierana wersja LTS) oraz npm. Po sklonowaniu repozytorium wykonaj w katalogu projektu:

```sh
npm ci
npm run dev
```

Otwórz adres pokazany w terminalu. Komenda `npm run build` sprawdza typy i buduje wersję produkcyjną w katalogu `dist/`.

## Scenariusz demonstracji

1. Wpisz `zablocie`, żeby pokazać wyszukiwanie bez polskich znaków.
2. Wyczyść pole wyszukiwania, wybierz **Biblioteki** i otwórz szczegóły czytelni.
3. Zapisz czytelnię i przejdź do **Zapisane**.
4. Odśwież stronę i ponownie otwórz **Zapisane**, żeby pokazać trwałość zapisu.

## Ilustracje

Pliki WebP w `public/images/` powstały przy użyciu wbudowanego narzędzia ImageGen. Opisy użyte do wygenerowania zdjęć obejmowały zabytkową bibliotekę w popołudniowym świetle (`hero.webp`), czytelnię ze sklepieniami i drewnianymi stołami (`library.webp`), stolik z cappuccino przy oknie kawiarni (`cafe.webp`) oraz jasny loft coworkingowy (`cowork.webp`).

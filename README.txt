==Passende Parkeernoorm info==

=Handlijding om de data te vervangen:=
1. het oude bestand backuppen door de naam te veranderen van data.csv naar data_backup_24dec2021.csv bijvoorbeeld.
2. De nieuwe excel in het evenbeelt creeren van de vormalige data.csv. Dit betekend waarschijlijk:
    - het hernomen van collomen
    - het verschuiiven van collomen
    - eventueel het toevoegen van een "nr" collom.
3. Let op en bevestig dat er niks veranderd is.
    - de zelefde headers
    - de zelefde volgoorden
    - het zelefde aantal collomen. Mocht er iets bij gekomen zijn doe deze dan aan het einde.
4. Let ook op de csv formating. en corrigeer deze eventueel met Find & Replace
    - deze is soms met ";" maar moet "," zijn
    - de comma getallen moeten met "." (punten) zijn neit met "," (echte commas). Tip: let op de volgoorde van je find and replace.
5. zorg dat het nieuwe bestand presies eht zelefde heet en op de zelefde plek staat.
6. upload het bestand naar de webserver.
7. syncorniser het Git project zo dat de ouden en nieuwe data ook in de git goed bewaard word.

= Handljding voor het live zetten =
- Selecteer alleen de benodigde files. bijvoorbeeld niet de backups, word bestanden en excel bestanden.
- denk er de eerste keer ook aan om glijk het Github project weer op prive te zetten.
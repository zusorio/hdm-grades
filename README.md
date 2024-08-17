# hdm-grades

This is an extension that helps calculate your average grade and various other statistics
on [HdM Stuttgart's](https://www.hdm-stuttgart.de/) portal
for [viewing grades](https://vw-online.hdm-stuttgart.de/qisserver).

![A screenshot of the extension showing various statistics in HdM's grade portal](/docs/demo.png)

Note that this does not support the new SELMA portal.

# How are grade averages calculated?

The system takes grades and multiplies them with their ECTS, then calculates the average and divides it by the total amount of ECTS.
It does this for the "Grundstudium" and "Hauptstudium".

Your final grade consists of:
- 15% The "Grundstudium" average
- 70% The "Hauptstudium" average
- 15% Your Thesis

ALL CALCULATIONS ARE WITHOUT ANY GUARANTEES OR WARRANTIES. CHECK THE SPO FOR THE OFFICIAL RULES.

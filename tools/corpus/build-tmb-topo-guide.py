# Rebuild tour-du-mont-blanc-topo-guide.pdf so page 4 carries BOTH Figure 4 and
# Figure 5, which is what Build 04's page_image vs paragraph_image exercise needs.
# Text, fonts, colours and margins reproduce the original exactly; the five
# embedded images are the originals, extracted losslessly from the source PDF.

import os

from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import Color
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Image, Spacer, PageBreak, KeepTogether,
)

IMG = os.environ.get("TMB_IMG_DIR", "./tmb-images")  # tmb_full_1.png … tmb_full_5.png
OUT = os.environ.get(
    "TMB_OUT",
    "../../courses/developer-foundations/builds/build-00-hello-arag/corpus/"
    "content_type/spec_sheet/tour-du-mont-blanc-topo-guide.pdf",
)

NAVY = Color(0.094118, 0.164706, 0.258824)
GREY = Color(0.501961, 0.501961, 0.501961)
MARGIN = 50.4  # + the frame's default 6pt padding = the original's 56.4pt text column

title = ParagraphStyle(
    "title", fontName="Helvetica-Bold", fontSize=22, leading=22, textColor=NAVY,
    spaceAfter=22,
)
head = ParagraphStyle(
    "head", fontName="Helvetica-Bold", fontSize=15, leading=18, textColor=NAVY,
    spaceAfter=18,
)
body = ParagraphStyle(
    "body", fontName="Helvetica", fontSize=10.5, leading=15, spaceAfter=18,
)
cap = ParagraphStyle(
    "cap", fontName="Helvetica", fontSize=8.5, leading=12, textColor=GREY,
    spaceBefore=6, spaceAfter=18,
)
foot = ParagraphStyle(
    "foot", fontName="Helvetica", fontSize=8.5, leading=12, textColor=GREY,
)


def fig(n, w):
    """Square maps are 1400x1400; the elevation profile is 1400x500."""
    src = f"{IMG}/tmb_full_{n}.png"
    h = w if n != 5 else w * 500.0 / 1400.0
    return Image(src, width=w, height=h)


story = [
    # --- Page 1 -------------------------------------------------------------
    Paragraph("Tour du Mont Blanc — Visual Topo Guide", title),
    Paragraph(
        "This companion guide adds route relief maps to the standard Tour du Mont "
        "Blanc trail guide. The 170 km circuit crosses France, Italy, and "
        "Switzerland around the Mont Blanc massif in 7 to 11 days. The overview "
        "map below shows the full counter-clockwise loop from Les Houches, with "
        "Courmayeur and Champex marking the Italian and Swiss legs.", body),
    fig(1, 460.8),
    Paragraph("Figure 1 — Full route overview, counter-clockwise from Les Houches.", cap),
    PageBreak(),

    # --- Page 2 -------------------------------------------------------------
    Paragraph("Days 1–3 — France: Les Houches to Refuge des Mottets", head),
    Paragraph(
        "The opening three days climb out of the Chamonix valley through Les "
        "Contamines and over the Col du Bonhomme before dropping to Refuge des "
        "Mottets on the Italian border. The segment map beside this paragraph "
        "traces that climb — note the steady elevation gain from Les Houches "
        "through Les Contamines, then the sharper pitch up to Refuge du Bonhomme.", body),
    fig(2, 403.2),
    Paragraph("Figure 2 — Days 1–3 segment relief map, France.", cap),
    PageBreak(),

    # --- Page 3 -------------------------------------------------------------
    Paragraph("Days 4–6 — Italy to Switzerland: Courmayeur to Champex", head),
    Paragraph(
        "From Courmayeur the route climbs past Refuge Bonatti — widely "
        "considered the best single viewpoint on the TMB — before crossing into "
        "Switzerland at La Fouly and descending to the lakeside village of Champex. "
        "The map beside this paragraph shows the Italy-to-Switzerland border "
        "crossing and the Bonatti balcony trail.", body),
    fig(3, 403.2),
    Paragraph("Figure 3 — Days 4–6 segment relief map, Italy → Switzerland.", cap),
    PageBreak(),

    # --- Page 4 — the two-image page ---------------------------------------
    Paragraph("Days 7–10 — Final Ridge: Champex to Les Houches", head),
    Paragraph(
        "The final four days cross back into France via the Col de Balme and finish "
        "along the ridge above Chamonix, with sweeping views back over the full "
        "massif on the descent into Les Houches. The segment map beside this "
        "paragraph shows that closing ridge line.", body),
    KeepTogether([
        fig(4, 300.0),
        Paragraph("Figure 4 — Days 7–10 segment relief map, final ridge.", cap),
    ]),
    Paragraph(
        "The elevation profile below summarises all ten days end to end — four "
        "major climbs above 2,000 m, each followed by a descent to valley-floor "
        "refuges.", body),
    KeepTogether([
        fig(5, 380.0),
        Paragraph("Figure 5 — Full-route elevation profile, 10-day standard itinerary.", cap),
    ]),
    PageBreak(),

    # --- Page 5 -------------------------------------------------------------
    Paragraph(
        "Recommended gear: Aurora TerraTrek 7 boots and the Aurora Skyline 45L pack "
        "— see Theo Sundberg's gear notes in the standard Tour du Mont Blanc "
        "trail guide for the full kit list.", body),
    Spacer(1, 12),
    Paragraph("Aurora Outfitters · Visual Trail Guide Series", foot),
]

doc = SimpleDocTemplate(
    OUT, pagesize=letter,
    leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN, bottomMargin=MARGIN,
    title="Tour du Mont Blanc — Visual Topo Guide",
    author="Aurora Outfitters",
)
doc.build(story)
print("wrote", OUT)

import random
from telegram import Update, ReplyKeyboardMarkup, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# የቦት ቶከንዎን እዚህ ያስገቡ
BOT_TOKEN = "8991112828:AAFXQc4yhGmMrAsE2nMcMuFMJvsERgxE-YM"
# የዌብ አፕዎ የተጫነበት ሊንክ (ለምሳሌ በ GitHub Pages ወይም በራስዎ ሰርቨር)
WEB_APP_URL = "https://your-domain.com"

# የቋንቋ እና የሜኑ መዋቅር (አማርኛ፣ ኦሮምኛ፣ እንግሊዝኛ፣ ትግርኛ)
TEXTS = {
    'am': {'start': "እንኳን ወደ ቤተሰብ ቢንጎ በደህና መጡ! 🎰", 'balance': "የእርስዎ ቀሪ ሂሳብ: 0.00 ብር"},
    'en': {'start': "Welcome to Betsebe Bingo! 🎰", 'balance': "Your Balance: 0.00 ETB"},
    'or': {'start': "Baga Gara Betsebe Bingo Nagayaan Dhuftan! 🎰", 'balance': "Harka Keessan: 0.00 ETB"},
    'ti': {'start': "እንቋዕ ብደሓን መጻእኩም ናብ ቤትሰብ ቢንጎ! 🎰", 'balance': "ዝተረፈ ሂሳብኩም: 0.00 ቅርሺ"}
}

# ዋናው የቴሌግራም ኪቦርድ ሜኑ
def get_main_menu():
    keyboard = [
        ['📝 Register', '🚀 Start Game'],
        ['💰 Deposit', '💵 Withdraw'],
        ['📈 Balance', 'ℹ️ Instruction'],
        ['🌐 Language', '📞 Support']
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # ተጠቃሚው መጀመሪያ /start ሲል የሚመጣለት
    await update.message.reply_text(
        "እንኳን ወደ ቤተሰብ ቢንጎ በደህና መጡ! እባክዎ ከታች ካሉት አማራጮች ይምረጡ።",
        reply_markup=get_main_menu()
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text

    if text == '🚀 Start Game':
        # ጨዋታውን በ Mini App መልክ ለመክፈት የዌብ አፕ በተን መፍጠር
        keyboard = [[InlineKeyboardButton("ጨዋታውን ክፈት (Open Game) 🎰", web_app=WebAppInfo(url=WEB_APP_URL))]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text("ጨዋታውን ለመጀመር ከታች ያለውን በተን ይጫኑ፡", reply_markup=reply_markup)

    elif text == '📈 Balance':
        await update.message.reply_text(TEXTS['am']['balance'])
        
    elif text == '🌐 Language':
        # የቋንቋ ምርጫ ማሳያ
        lang_keyboard = [
            [InlineKeyboardButton("አማርኛ", callback_data='lang_am'), InlineKeyboardButton("Afaan Oromoo", callback_data='lang_or')],
            [InlineKeyboardButton("English", callback_data='lang_en'), InlineKeyboardButton("ትግርኛ", callback_data='lang_ti')]
        ]
        await update.message.reply_text("እባክዎ ቋንቋ ይምረጡ / Please select a language:", reply_markup=InlineKeyboardMarkup(lang_keyboard))
        
    elif text == 'ℹ️ Instruction':
        await update.message.reply_text("የጨዋታ መመሪያ፡\n1. ከ 1 እስከ 600 ካርቴላዎችን ይምረጡ (እስከ 5 ካርቴላ)\n2. በ49 ሰከንድ ውስጥ መርጠው ይጨርሱ\n3. ቁጥሮች በলাইቭ ሲጠሩ የእርስዎ ካርቴላ ከሞላ ቢንጎ ይላሉ!")
        
    else:
        await update.message.reply_text(f"የመረጡት አማራጭ፡ {text} (ይህ ክፍል በዳታቤዝ ግንኙነት የሚሰራ ነው)")

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    print("ቦቱ ስራ ጀምሯል...")
    app.run_polling()

if name == 'main':
    main()
from telegram import Update, ReplyKeyboardMarkup, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

BOT_TOKEN = "8991112828:AAFXQc4yhGmMrAsE2nMcMuFMJvsERgxE-YM"
WEB_APP_URL = "https://eyuvan.github.io/edlbingo/" # የጊትሀብ ሊንክህ

TEXTS = {
    'am': {'start': "እንኳን ወደ እድል ቢንጎ (Lucky Bingo) በደህና መጡ! 🎰", 'balance': "የእርስዎ ቀሪ ሂሳብ: 10.00 ብር"},
    'en': {'start': "Welcome to Lucky Bingo! 🎰", 'balance': "Your Balance: 10.00 ETB"}
}

def get_main_menu():
    keyboard = [
        ['📝 Register', '🚀 Start Game'],
        ['💰 Deposit', '💵 Withdraw'],
        ['📈 Balance', 'ℹ️ Instruction'],
        ['🌐 Language', '📞 Support']
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        TEXTS['am']['start'],
        reply_markup=get_main_menu()
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text

    if text == '🚀 Start Game':
        keyboard = [[InlineKeyboardButton("ጨዋታውን ክፈት (Open Lucky Bingo) 🎰", web_app=WebAppInfo(url=WEB_APP_URL))]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text("ጨዋታውን ለመጀመር ከታች ያለውን በተን ይጫኑ፡", reply_markup=reply_markup)

    elif text == '📈 Balance':
        await update.message.reply_text(TEXTS['am']['balance'])
        
    elif text == 'ℹ️ Instruction':
        await update.message.reply_text("የጨዋታ መመሪያ፡\n1. ከ 1 እስከ 600 ካርቴላዎችን ይምረጡ (እስከ 5 ካርቴላ)\n2. በ49 ሰከንድ ውስጥ መርጠው ይጨርሱ\n3. ጊዜው ሲያልቅ ምርጫው ይዘጋል!")
        
    else:
        await update.message.reply_text(f"የመረጡት አማራጭ፡ {text}")

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    print("እድል ቢንጎ ቦት ስራ ጀምሯል...")
    app.run_polling()

if __name__ == '__main__':
    main()
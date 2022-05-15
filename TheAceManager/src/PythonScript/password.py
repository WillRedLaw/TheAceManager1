# This script has been created to
# takes in four strings, of varying characters, numbers, and specials arranges them in a random order
# and print it out to the system console to be able to use it
# it will also including hashing/encyting the passwords at this stage of the process once produced.

import random
import array
from string import digits

Max_Len = 12

#the different variables that will be used
Digits = ['0','1','2','3','4','5','6','7','8','9']
Lower_Case_Characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q','r', 's', 't', 'u', 'v', 'w', 'x', 'y','z']
Uppercase_Characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I', 'J', 'K', 'M', 'N', 'O', 'p', 'Q','R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y','Z']
Symbols = ['@', '#', '$', '%', '=', ':', '?', '.', '/', '|', '~', '>', '*', '(', ')', '<']

#adding them all to a list
Combined_List = Digits + Uppercase_Characters + Lower_Case_Characters + Symbols

#making the random choice
Random_Digits = random.choice(Digits)
Random_Upper = random.choice(Uppercase_Characters)
Random_Lower = random.choice(Lower_Case_Characters)
Random_Symbols = random.choice(Symbols)

#putting them all together
temp_pass = Random_Digits + Random_Upper + Random_Lower + Random_Symbols

#Loop for creating the password
for x in range(Max_Len - 4):
    temp_pass = temp_pass + random.choice(Combined_List)

    temp_pass_list = array.array("u", temp_pass)
    random.shuffle(temp_pass_list)

    password = ""

    for x in temp_pass_list:
        password = password + x


print(password)
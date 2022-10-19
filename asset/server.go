/*
Server Management using GOlang.
Modified on 18/8/2022
Modified by Sushmitha B Kongi
This file contains funtions related to add asset,list all asset as infra admin(role).
*/
package asset

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
	dbs "servermanagement.com/infraadmin/database"
)

type Asset[T any] struct {
	Asset_Id       int       `json:"Asset_Id"`
	Asset_Name     string    `json:"Asset_Name"`
	Manufacturer   string    `json:"Manufacturer"`
	BMC_IP         string    `json:"BMC_IP"`
	BMC_User       string    `json:"BMC_User"`
	BMC_Password   string    `json:"BMC_Password"`
	Asset_Location string    `json:"Asset_Location"`
	Reserved       bool      `json:"Reserved"`
	Assigned_by    string    `json:"Assigned_by"`
	Assigned_to    T         `json:"Assigned_to"`
	Assigned_from  time.Time `json:"Assigned_from"`
	Created_on     time.Time `json:"Created_on"`
	Created_by     string    `json:"Created_by"`
	Updated_on     time.Time `json:"Updated_on"`
	Updated_by     string    `json:"Updated_by"`
	OS_IP          string    `json:"OS_IP"`
	OS_User        string    `json:"OS_User"`
	OS_Password    string    `json:"OS_Password"`
	Purpose        string    `json:"Purpose"`
	Cluster_Id     string    `json:"Cluster_Id"`
	Delete         int       `json:"Delete"`
	Status         bool      `json:"Status"`
}
type userDetails struct {
	User_Id    int       `json:"User_Id"`
	Email_Id   string    `json:"Email_Id"`
	Password   string    `json:"Password"`
	First_Name string    `json:"First_Name"`
	Last_Name  string    `json:"Last_Name"`
	Created_on time.Time `json:"Created_on"`
	Created_by string    `json:"Created_by"`
	Updated_on time.Time `json:"Updated_on"`
	Updated_by string    `json:"Updated_by"`
	Role       string    `json:"Role"`
	Teams      string    `json:"Teams"`
	Delete     int       `json:"Delete"`
}
type Historic_details[T any] struct {
	Id            int       `json:"Id"`
	Asset_Id      int       `json:"Asset_Id"`
	Assigned_to   T         `json:"Assigned_to"`
	Assigned_from time.Time `json:"Assigned_from"`
	Updated_on    time.Time `json:"Updated_on"`
	Updated_by    string    `json:"Updated_by"`
	Remarks       string    `json:"Remarks"`
}
type Server_Request struct {
	Id                      int       `json:"Id"`
	User_No                 int       `json:"User_No"`
	Creator                 string    `json:"Creator"`
	Start_Date              time.Time `json:"Start_Date"`
	End_Date                time.Time `json:"End_Date"`
	Manufacturer            string    `json:"Manufacturer"`
	Number_Of_Servers       string    `json:"Number_Of_Servers"`
	Operating_System        string    `json:"Operating_System"`
	Cpu_model               string    `json:"Cpu_model"`
	CPU_Sockets             string    `json:"CPU_Sockets"`
	DIMM_Size               string    `json:"DIMM_Size"`
	DIMM_Capacity           string    `json:"DIMM_Capacity"`
	Storage_Vendor          string    `json:"Storage_Vendor"`
	Storage_Controller      string    `json:"Storage_Controller"`
	Storage_Capacity        string    `json:"Storage_Capacity"`
	Network_Type            bool      `json:"Network_Type"`
	Network_speed           string    `json:"Network_speed"`
	Number_Of_Network_Ports string    `json:"Number_Of_Network_Ports"`
	Special_Switching_Needs string    `json:"Special_Switching_Needs"`
	Infraadmin_Comments     string    `json:"Infraadmin_Comments"`
	User_Comments           string    `json:"User_Comments"`
	Request                 bool      `json:"Request"`
}
type changepwd struct {
	Email_Id     string `json:"Email_Id"`
	Old_Password string `json:"Old_Password"`
	New_Password string `json:"New_Password"`
}
type Users_DETAILS struct {
	Email_Id string `json:"Email_Id"`
	Password string `json:"Password"`
}
type loginDetails struct {
	Email_Id string `json:"Email_Id"`
	Password string `json:"Password"`
}
type Claims struct {
	Username string `json:"Username"`
	jwt.StandardClaims
}

type Chat struct {
	Id      int      `json:"Id"`
	Comment []string `json:"Comment"`
	// Date    string   `json:"Date"`
}

var db = dbs.Connect() //database connection using function
var secretkey string = "Infobellitsolution"
var jwtKey = []byte("InfobellItSolutions")
var v Server_Request

//--------------------------------------------------cors policy disabled---------------------------------------------------------------
// func SetupCORS(w *http.ResponseWriter) {
// 	fmt.Println("Inside CORS")
// 	(*w).Header().Set("Access-Control-Allow-Origin", "http:localhost:5002")
// 	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
// 	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

// }

//----------------------------------------------------authorization file----------------------------------------------------------

func GeneratehashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
func GenerateJWT(email, role string) (string, error) {
	var mySigningKey = []byte(secretkey)
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["email"] = email
	claims["role"] = role
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	tokenString, err := token.SignedString(mySigningKey)

	if err != nil {
		fmt.Printf("Something Went Wrong: %s", err.Error())
		return "", err
	}
	return tokenString, nil
}

func RefreshHandler(w http.ResponseWriter, r *http.Request) {
	//SetupCORS(&w)
	cookie, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenStr := cookie.Value

	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !tkn.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.Write([]byte(fmt.Sprintf("Hello, %s", claims.Username)))
}

func HandleFunc() {
	mux := http.NewServeMux()
	//----------------------------------------------------login----------------------------------------------------------------------
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Login(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var l loginDetails

		err := json.NewDecoder(r.Body).Decode(&l)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Message": "Invalid Input Syntax", "Status Code": "400 "})
			return
		}

		if l.Email_Id == "" || l.Password == "" {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]string{"Status Code": "202", "Message": "Email/Password Can't be empty"})
			return

		} else {
			row := db.QueryRow("SELECT User_ID,Email_ID,Password,Role from Users where Email_ID = '" + l.Email_Id + "'")
			// if(row==null || [])
			var EMAIL, PASSWORD, ROLE string
			var id int
			ID := strconv.Itoa(id)
			err_scan := row.Scan(&ID, &EMAIL, &PASSWORD, &ROLE)
			fmt.Println(EMAIL)
			if err_scan != nil {
				//panic(err_scan.Error())
				fmt.Println(err_scan)
				//fmt.Println("error in email")
			}
			fmt.Println("Compared result :", CheckPasswordHash(l.Password, PASSWORD))
			if ID == "" || EMAIL == "" || PASSWORD == "" || ROLE == "" {
				w.WriteHeader(http.StatusAccepted)
				json.NewEncoder(w).Encode(map[string]string{"Status Code": "202", "Message": "Invalid Email"})
			} else if CheckPasswordHash(l.Password, PASSWORD) {
				expirationTime := time.Now().Add(time.Minute * 5)
				claims := &Claims{
					Username: EMAIL,
					StandardClaims: jwt.StandardClaims{
						ExpiresAt: expirationTime.Unix(),
					},
				}

				token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
				tokenString, err := token.SignedString(jwtKey)
				if err != nil {
					fmt.Println("Error in generating JWT Err : ", err.Error())
					w.WriteHeader(http.StatusInternalServerError)
					json.NewEncoder(w).Encode(map[string]string{"Message": "The server encountered an unexpected condition that prevented it from fulfilling the request", "Status Code": "500 "})

					return
				}

				// http.SetCookie(w, &http.Cookie{
				//  Name:    "token",
				//  Value:   tokenString,
				//  Expires: expirationTime,
				// })

				username := strings.Split(l.Email_Id, "@")
				json.NewEncoder(w).Encode(map[string]string{"User_Id": ID, "Role": ROLE, "Username": username[0], "Token": tokenString, "status": "200 OK", "Message": "Successfully Logged In"})
			} else {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"Status Code": "401", "Message": "Invalid password"})
			}

		}
	})

	//--------------------------------------------------------logout-----------------------------------------------------------------
	mux.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Logout(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		cookie, err := r.Cookie("token")
		if err != nil {
			if err == http.ErrNoCookie {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		tokenStr := cookie.Value

		claims := &Claims{}

		tkn, err := jwt.ParseWithClaims(tokenStr, claims,
			func(t *jwt.Token) (interface{}, error) {
				return jwtKey, nil
			})

		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if !tkn.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "200ok", "Message": "successfully logout", "By:": claims.Username})
	})

	//----------------------------------------------------Change Password----------------------------------------------------------
	mux.HandleFunc("/ChangePassword", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func ChangePassword(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}

		var p changepwd

		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Message": "Invalid Input Syntax", "Status Code": "400 "})
			return
		}
		if p.Old_Password == "nil" || p.New_Password == "nil" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Status Code": "400", "Message": "Invalid input syntax"})
			return

		} else {
			//id := strconv.Itoa(p.User_id)
			row := db.QueryRow("SELECT Email_Id,Password from Users where Email_Id = $1", p.Email_Id)
			//fmt.Println(row)
			var db_user, Password string
			err_scan := row.Scan(&db_user, &Password)
			if err_scan != nil {
				//panic(err_scan.Error())
				fmt.Println(err_scan.Error())
			}
			if db_user == "" || Password == "" {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"Status Code": "400", "Message": "Invalid input syntax"})
			} else {
				//if user is available in table and password you entered matches the old password,new password is updated on table.
				temp_pwd, _ := GeneratehashPassword(p.New_Password)
				fmt.Println(temp_pwd)
				if CheckPasswordHash(p.Old_Password, Password) {
					hash_pwd, err_h := GeneratehashPassword(p.New_Password)
					fmt.Println(hash_pwd)
					if err_h != nil {
						log.Fatal(err_h)
					}
					change, err := db.Exec("update Users set Password =$1 where Email_Id=$2", hash_pwd, p.Email_Id)
					if err != nil {
						log.Fatal(err)
					}
					affectedRow, err := change.RowsAffected()
					if err != nil {
						log.Fatal(err)
					}
					json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "200", "Message": "Password Updated", "updated row": affectedRow})
				} else {
					w.WriteHeader(http.StatusUnauthorized)
					json.NewEncoder(w).Encode(map[string]string{"Status Code": "401", "Message": "Unauthorised Password"})

				}
			}

		}
	})

	//-----------------------------------------------------Reset password-----------------------------------------------------
	mux.HandleFunc("/ResetPassword", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func ResetPassword(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var p Users_DETAILS //declare a variable p for type Users_DETAILS
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		//To convert the password in the encrypted form
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(p.Password), 14)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Status Code": "400", "Message": "Invalid input syntax"})
			return
		}

		var EmailId string
		err = db.QueryRow("SELECT Email_Id from Users where Email_Id =$1", p.Email_Id).Scan(&EmailId)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "User doesn't exist", "err": err, "Status Code": "404"})
			return
		}
		_, err2 := db.Exec("UPDATE Users SET Password=$2 WHERE Email_Id=$1;", p.Email_Id, string(hashedPassword))

		if err2 != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err2, "Status Code": "202 Accepted"})
			return
		}

		json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Password Reset Successful!", "Status Code": "200 OK"})

	})

	//------------------------------------------------add asset(creating asset)---------------------------------------------------------------------
	mux.HandleFunc("/add_asset", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func AddAsset(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var assets Asset[int]
		var Asset_Id int
		Asset_Id = 0

		err := json.NewDecoder(r.Body).Decode(&assets)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Message": "Invalid Input Syntax", "Status Code": "400 "})
			return
		}

		err = db.QueryRow("Select Asset_Id from Asset where Asset_Id=$1", assets.Asset_Id).Scan(&Asset_Id)

		Asset_Id = Asset_Id + 1
		addStatement := `INSERT INTO asset (Asset_Name,Manufacturer, BMC_IP, BMC_User, BMC_Password, Asset_location,Created_on,Created_by,OS_IP,OS_User,OS_Password,Purpose,Cluster_Id,Delete,Reserved) VALUES ($1,$2,$3,$4,$5,$6,CURRENT_DATE,$7,$8,$9,$10,$11,$12,'0','f')`
		_, err = db.Exec(addStatement, assets.Asset_Name, assets.Manufacturer, assets.BMC_IP, assets.BMC_User, assets.BMC_Password, assets.Asset_Location, assets.Created_by, assets.OS_IP, assets.OS_User, assets.OS_Password, assets.Purpose, assets.Cluster_Id)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Println(err)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Invalid input syntax for IP ", "Status Code": "400 ", "Error": err})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "200 OK", "Message": "Recorded sucessfully"})
	})

	//--------------------------------------------Platform Profile---------------------------------------------------------------------
	mux.HandleFunc("/platformProfile", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func PlatformProfile(w http.ResponseWriter, r *http.Request) {
		//	SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		b, _ := ioutil.ReadFile("PlatformProfile.json")
		rawIn := json.RawMessage(string(b))
		var objmap map[string]*json.RawMessage
		err := json.Unmarshal(rawIn, &objmap)
		if err != nil {
			fmt.Println(err)
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"PlatformProfile": objmap, "Status Code": "200 OK", "Message": "Recorded sucessfully"})
	})

	//--------------------------------------------Dashboard:number of reserved and vacant asset---------------------------------------------------------------------
	mux.HandleFunc("/dashboard1", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetDashboard1(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var count, vacant int
		err := db.QueryRow("SELECT count(*) from asset WHERE reserved is true").Scan(&count) // exporting table
		if err != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
			return
		}
		err1 := db.QueryRow(" SELECT count(*) from asset WHERE reserved is false and delete=B'0'").Scan(&vacant) // exporting table
		if err1 != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err1, "Status Code": "202 "})
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"reserved": count, "vacant": vacant, "Status Code": "200 OK", "Message": "Updated Statistics"})
	})

	//--------------------------------------------Dashboard:number of reserved and vacant asset in cluster---------------------------------------------------------------------
	type data1 struct {
		Cluster_Id string `json:"Cluster_Id"`
		Reserved   int    `json:"Reserved"`
		Vacant     int    `json:"Vacant"`
	}

	mux.HandleFunc("/dashboard2", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetDashboard2(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		rows, err := db.Query("SELECT cluster_id, count(case when reserved='t' then 1 else null end) as reserved, count (case when (reserved='f' or reserved is null) and delete=B'0' then 1 else null end)as vacant from asset group by cluster_id;")
		if err != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
			return
		}
		fmt.Printf("Cluster_Id|Reserved|Vacant\n")
		dash := []data1{}
		for rows.Next() {
			var Reserved, Vacant int
			var Cluster_Id string
			err := rows.Scan(&Cluster_Id, &Reserved, &Vacant)
			if err != nil {
				w.WriteHeader(http.StatusAccepted)
				json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
				return
			}
			dash = append(dash, data1{Cluster_Id: Cluster_Id, Reserved: Reserved, Vacant: Vacant})
			fmt.Printf("%v : %v: %v\n ", Cluster_Id, Reserved, Vacant)
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Dashboard": dash, "Status Code": "200 OK", "Message": "Updated Statistics"})
	})

	//--------------------------------------------Dashboard:number of reserved by location---------------------------------------------------------------------
	type data struct {
		Location string `json:"Location"`
		Reserved int    `json:"Reserved"`
		Vacant   int    `json:"Vacant"`
	}

	mux.HandleFunc("/dashboard3", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetDashboard3(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		rows, err := db.Query(" SELECT asset_location, COUNT(CASE WHEN reserved='t' THEN 1 ELSE NULL END)AS reserved,  COUNT(CASE WHEN (reserved='f' or reserved is null) and delete=B'0' THEN 1 ELSE NULL END)AS vacant FROM asset group by asset_location")
		if err != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
			return
		}
		fmt.Printf("Location|Reserved|Vacant\n")
		dash := []data{}
		for rows.Next() {
			var Reserved, Vacant int
			var Location string
			err := rows.Scan(&Location, &Reserved, &Vacant)
			if err != nil {
				w.WriteHeader(http.StatusAccepted)
				json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
				return
			}
			dash = append(dash, data{Location: Location, Reserved: Reserved, Vacant: Vacant})
			fmt.Printf("%v : %v: %v\n ", Location, Reserved, Vacant)
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Dashboard": dash, "Status Code": "200 OK", "Message": "Updated Statistics"})
	})

	//-----------------------------------------------------------Filter Dashboard location---------------------------------------------------------------------------
	mux.HandleFunc("/dashboard4", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetDashboard4(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var p Asset[int]
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Status Code": "400", "Message": "Invalid input syntax"})
			return
		}
		rows, err := db.Query(" SELECT asset_location, COUNT(CASE WHEN reserved='t' THEN 1 ELSE NULL END)AS reserved,  COUNT(CASE WHEN (reserved='f' or reserved is null) and delete=B'0' THEN 1 ELSE NULL END)AS vacant FROM asset where asset_location= $1 group by asset_location", p.Asset_Location)
		if err != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
			return
		}
		fmt.Printf("Location|Reserved|Vacant\n")
		var Reserved, Vacant int
		var Location string
		for rows.Next() {

			err := rows.Scan(&Location, &Reserved, &Vacant)
			if err != nil {
				w.WriteHeader(http.StatusAccepted)
				json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
				return
			}
			fmt.Printf("%v : %v: %v\n ", Location, Reserved, Vacant)
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Location": &Location, "Reserved": &Reserved, "Vacant": &Vacant, "Status Code": "200 OK", "Message": "Updated Statistics"})
	})

	//--------------------------------------------Dashboard5: Timeline vs no of servers-------------------------------------
	type data2 struct {
		Time     string `json:"Time"`
		Reserved int    `json:"Reserved"`
		Vacant   int    `json:"Vacant"`
	}

	mux.HandleFunc("/dashboard5", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetDashboard5(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		rows, err := db.Query("(SELECT DISTINCT 'A#6 Months' AS time,(SELECT COUNT(*) FROM asset WHERE reserved='t' AND EXTRACT(DAY FROM NOW() - assigned_from)<=182) AS no_of_reserved, (SELECT COUNT(*) FROM asset WHERE reserved='f' AND delete=B'0' AND EXTRACT(DAY FROM NOW() - assigned_from)<=182) AS no_of_vacant FROM asset WHERE EXTRACT(DAY FROM NOW() - assigned_from)<=182) UNION (SELECT DISTINCT 'B#1 Year' AS time,(SELECT COUNT(*) FROM asset WHERE reserved='t' AND (EXTRACT(DAY FROM NOW() - assigned_from)> 182 AND EXTRACT(DAY FROM NOW() - assigned_from)<=365)) AS no_of_reserved, (SELECT COUNT(*) FROM asset WHERE reserved='f' AND delete=B'0' AND (EXTRACT(DAY FROM NOW() - assigned_from)> 182 AND EXTRACT(DAY FROM NOW() - assigned_from)<=365)) AS no_of_vacant FROM asset WHERE (EXTRACT(DAY FROM NOW() - assigned_from)> 182 AND EXTRACT(DAY FROM NOW() - assigned_from)<=365)) UNION (SELECT DISTINCT 'C#1.5 Years' AS time,(SELECT COUNT(*) FROM asset WHERE reserved='t' AND (EXTRACT(DAY FROM NOW() - assigned_from)> 365 AND EXTRACT(DAY FROM NOW() - assigned_from)<=574)) AS no_of_reserved, (SELECT COUNT(*) FROM asset WHERE reserved='f' AND delete=B'0' AND (EXTRACT(DAY FROM NOW() - assigned_from)> 365 AND EXTRACT(DAY FROM NOW() - assigned_from)<=574)) AS no_of_vacant FROM asset WHERE (EXTRACT(DAY FROM NOW() - assigned_from)> 365 AND EXTRACT(DAY FROM NOW() - assigned_from)<=574)) UNION (SELECT DISTINCT 'D#2 Years' AS time,(SELECT COUNT(*) FROM asset WHERE reserved='t' AND (EXTRACT(DAY FROM NOW() - assigned_from)>574)) AS no_of_reserved, (SELECT COUNT(*) FROM asset WHERE reserved='f' AND delete=B'0' AND (EXTRACT(DAY FROM NOW() - assigned_from)>574)) AS no_of_vacant FROM asset WHERE (EXTRACT(DAY FROM NOW() - assigned_from)>574)) ORDER BY time ASC;")
		if err != nil {
			log.Fatal(err)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "400 Bad Request", "Message": err})
		}
		fmt.Printf("Time|Reserved|Vacant\n")
		dash := []data2{}
		for rows.Next() {
			var Reserved, Vacant int
			var Time string
			err := rows.Scan(&Time, &Reserved, &Vacant)
			if err != nil {
				log.Fatal(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"status": "400 Bad Request", "Message": err})
			}
			Time = strings.Split(Time, "#")[1]
			dash = append(dash, data2{Time: Time, Reserved: Reserved, Vacant: Vacant})
			fmt.Printf("%v | %v| %v\n ", Time, Reserved, Vacant)
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Dashboard": dash, "Status": "200 OK", "Message": "Updated Statistics"})
	})

	//----------------------------------------------------------Assign Server--------------------------------------------------------------------------
	mux.HandleFunc("/assign_asset", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Assign_asset(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var p Asset[int]
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Invalid Syntax", "Status Code": "400 "})
			return
		}

		var reserved bool
		var delete int
		err = db.QueryRow("SELECT Reserved , Delete FROM Asset where Asset_ID=$1", p.Asset_Id).Scan(&reserved, &delete)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Server already in use", "Status Code": "401 "})
			return
		}
		if !reserved && delete == 0 {

			_, err = db.Exec("UPDATE asset SET Assigned_to=$2,Assigned_from=CURRENT_DATE,Assigned_by=$3,Updated_on=CURRENT_DATE,Updated_by=$4,reserved = 'true',status='true' WHERE Asset_ID=$1;", p.Asset_Id, p.Assigned_to, p.Assigned_by, p.Updated_by)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"Message": "Invalid Input Syntax", "Status Code": "400 "})
				return
			}

			_, err := db.Exec(`INSERT into Historic_details (Asset_ID,Assigned_to,Assigned_from,Updated_on,Updated_by,Remarks)
		SELECT Asset_ID,Assigned_to,Assigned_from,Updated_on,Updated_by,'Server Assigned' FROM Asset where Asset_ID=$1`, p.Asset_Id)

			if err != nil {
				fmt.Println(err)
			}

			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Server Assigned", "Status Code": "200 OK"})

		} else {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Server cannot be assigned", "Status Code": "401"})

		}
	})

	//-------------------------------------------------Delete Server(Updating delete and reserved column in asset table)-------------------------------
	mux.HandleFunc("/delete_asset", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Delete_asset(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var p Asset[int]
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "400 "})
			return
		}
		_, err = db.Exec("UPDATE asset SET Delete='1', Reserved = 'f' , Assigned_to = null WHERE Asset_Id=$1;", p.Asset_Id)
		if err != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Deleted Server!", "Status Code": "200 OK"})
		row := db.QueryRow("SELECT Delete from asset where Asset_Id=$1;", p.Asset_Id)
		var del int
		err1 := row.Scan(&del)
		if err1 != nil {
			log.Fatal(err1)
		}
		if !p.Reserved && del == 1 {
			_, err := db.Query(`INSERT into Historic_details (Asset_ID,Assigned_to,Assigned_from,Updated_ON,Updated_by,Remarks) 
		SELECT Asset_ID,Assigned_to,Assigned_from,Updated_ON,Updated_by,'Server Deleted' FROM Asset where Asset_Id=$1`, p.Asset_Id)
			if err != nil {
				w.WriteHeader(http.StatusAccepted)
				json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
				return
			}
		} else {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "No update required", "Status Code": "202"})
		}
	})

	//-----------------------------------------------------List server ------------------------------------------------
	mux.HandleFunc("/list_asset", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func ListServer(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		str := "SELECT Asset_ID, Asset_Name,Manufacturer,BMC_IP,BMC_User,Asset_location,COALESCE(Reserved,false),COALESCE(Assigned_to, 0),COALESCE(Assigned_from, '0001-01-01'),COALESCE(Assigned_by, ''),Created_on,Created_by,COALESCE(Updated_on,'0001-01-01'),COALESCE(Updated_by, ''),OS_IP ,OS_User,Purpose,COALESCE(Cluster_ID,''),Delete,COALESCE(Status, false) FROM Asset"

		rows, err := db.Query(str)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "400 "})
			return
		}
		result := []Asset[string]{} // creating slice
		for rows.Next() {
			var Asset_Id, Assigned_to, Delete int
			var Asset_Name, Manufacturer, OS_IP, OS_User, BMC_IP, BMC_User, Asset_Location, Assigned_by, Created_by, Updated_by, Cluster_Id, Purpose string
			var Created_on, Updated_on, Assigned_from time.Time
			var Status, Reserved bool

			err := rows.Scan(&Asset_Id, &Asset_Name, &Manufacturer, &BMC_IP, &BMC_User, &Asset_Location, &Reserved, &Assigned_to, &Assigned_from, &Assigned_by, &Created_on, &Created_by, &Updated_on, &Updated_by, &OS_IP, &OS_User, &Purpose, &Cluster_Id, &Delete, &Status)

			if err != nil {
				fmt.Println(err)
				log.Printf("Failed to build content from sql rows: %v\n", err)

			}

			marshal, _ := json.Marshal(result)
			var c []Historic_details[string]
			var username []string
			var mail string
			var user string
			_ = json.Unmarshal(marshal, &c)
			err = db.QueryRow(" SELECT Email_ID FROM users where User_ID=$1;", Assigned_to).Scan(&mail)
			if err != nil {
				fmt.Println(err)
			}
			username = strings.Split(mail, "@")
			user = username[0]
			result = append(result, Asset[string]{Asset_Id: Asset_Id, Asset_Name: Asset_Name, Manufacturer: Manufacturer, BMC_IP: BMC_IP, BMC_User: BMC_User, Asset_Location: Asset_Location, Reserved: Reserved, Assigned_to: user, Assigned_by: Assigned_by, Assigned_from: Assigned_from, Created_by: Created_by, Created_on: Created_on, Updated_by: Updated_by, Updated_on: Updated_on, OS_IP: OS_IP, OS_User: OS_User, Cluster_Id: Cluster_Id, Purpose: Purpose, Delete: Delete, Status: Status})
		}
		rev_slc := []Asset[string]{}
		for i := range result {
			// reverse the order
			rev_slc = append(rev_slc, result[len(result)-1-i])
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"ListAsset": rev_slc, "Status Code": "200 OK", "Message": "Listing all assets"})
	})

	// ----------------------------------------------list of Reserved Assets-----------------------------------------------------------
	mux.HandleFunc("/list_asset/Reserved", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Reserved(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		str := "SELECT Asset_ID,Asset_Name,Manufacturer,BMC_IP,BMC_User,Asset_location,COALESCE(Reserved,false),COALESCE(Assigned_to,0),COALESCE(Assigned_from,'0001-01-01'),COALESCE(Assigned_by,' '),COALESCE(Created_on,'0001-01-01'),Created_by,COALESCE(Updated_on,'0001-01-01'),Updated_by,OS_IP,OS_User,Purpose,Cluster_ID,Delete,COALESCE(Status,false) FROM Asset where Reserved=true"
		rows, err := db.Query(str)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "400 "})
			return
		}
		result := []Asset[string]{} // creating slice
		var Asset_Id, Assigned_to, Delete int
		var Asset_Name, Manufacturer, OS_IP, OS_User, BMC_IP, BMC_User, Asset_Location, Assigned_by, Created_by, Updated_by, Cluster_Id, Purpose string
		var Created_on, Updated_on, Assigned_from time.Time
		var Status, Reserved bool
		for rows.Next() {
			err := rows.Scan(&Asset_Id, &Asset_Name, &Manufacturer, &BMC_IP, &BMC_User, &Asset_Location, &Reserved, &Assigned_to, &Assigned_from, &Assigned_by, &Created_on, &Created_by, &Updated_on, &Updated_by, &OS_IP, &OS_User, &Purpose, &Cluster_Id, &Delete, &Status)

			if err != nil {
				fmt.Println(err)
				log.Printf("Failed to build content from sql rows: %v\n", err)

			}

			marshal, _ := json.Marshal(result)
			var c []Historic_details[string]
			var username []string
			var mail string
			var user string
			_ = json.Unmarshal(marshal, &c)
			err = db.QueryRow(" SELECT Email_ID FROM users where User_ID=$1;", Assigned_to).Scan(&mail)
			if err != nil {
				fmt.Println(err)
			}
			username = strings.Split(mail, "@")
			user = username[0]
			result = append(result, Asset[string]{Asset_Id: Asset_Id, Asset_Name: Asset_Name, Manufacturer: Manufacturer, BMC_IP: BMC_IP, BMC_User: BMC_User, Asset_Location: Asset_Location, Reserved: Reserved, Assigned_to: user, Assigned_by: Assigned_by, Assigned_from: Assigned_from, Created_by: Created_by, Created_on: Created_on, Updated_by: Updated_by, Updated_on: Updated_on, OS_IP: OS_IP, OS_User: OS_User, Cluster_Id: Cluster_Id, Purpose: Purpose, Delete: Delete, Status: Status})
		} // appending deatils to the result
		rev_slc := []Asset[string]{}
		for i := range result {
			// reverse the order
			rev_slc = append(rev_slc, result[len(result)-1-i])
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"ListAsset": rev_slc, "Status Code": "200 OK", "Message": "Listing all assets"})
	})

	// --------------------------------------------------list of pools Assets--------------------------------------------------------
	mux.HandleFunc("/list_asset/pool", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Pool(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}

		str := "SELECT Asset_ID,Asset_Name,Manufacturer,BMC_IP,BMC_User,Asset_location,COALESCE(Reserved,false),COALESCE(Assigned_to,0),COALESCE(Assigned_from,'0001-01-01'),COALESCE(Assigned_by,' '),COALESCE(Created_on,'0001-01-01'),Created_by,COALESCE(Updated_on,'0001-01-01'),COALESCE(Updated_by,' '),OS_IP,OS_User,Purpose,Cluster_ID,Delete,COALESCE(Status,false) FROM Asset where Delete=B'0' AND Reserved='false' OR Reserved is null "

		rows, err := db.Query(str)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "400 "})
			return
		}
		result := []Asset[string]{} // creating slice
		for rows.Next() {

			var Asset_ID, Assigned_to, Delete int
			var Assigned_from, Updated_on, Created_on time.Time
			var Asset_Name, Manufacturer, OS_IP, OS_User, BMC_IP, BMC_user, Asset_location, Assigned_by, Created_by, Updated_by, Cluster_ID, Purpose string
			var Reserved, Status bool
			err := rows.Scan(&Asset_ID, &Asset_Name, &Manufacturer, &BMC_IP, &BMC_user, &Asset_location, &Reserved, &Assigned_to, &Assigned_from, &Assigned_by, &Created_on, &Created_by, &Updated_on, &Updated_by, &OS_IP, &OS_User, &Purpose, &Cluster_ID, &Delete, &Status)

			if err != nil {
				fmt.Println(err)
				log.Printf("Failed to build content from sql rows: %v\n", err)

			}

			marshal, _ := json.Marshal(result)
			var c []Historic_details[string]
			var username []string
			var mail string
			var user string
			_ = json.Unmarshal(marshal, &c)
			err = db.QueryRow(" SELECT Email_ID FROM users where User_ID=$1;", Assigned_to).Scan(&mail)
			if err != nil {
				fmt.Println(err)
			}
			username = strings.Split(mail, "@")
			user = username[0]
			result = append(result, Asset[string]{Asset_Id: Asset_ID, Asset_Name: Asset_Name, Manufacturer: Manufacturer, BMC_IP: BMC_IP, BMC_User: BMC_user, Asset_Location: Asset_location, Reserved: Reserved, Assigned_to: user, Assigned_by: Assigned_by, Assigned_from: Assigned_from, Created_by: Created_by, Created_on: Created_on, Updated_by: Updated_by, Updated_on: Updated_on, OS_IP: OS_IP, OS_User: OS_User, Cluster_Id: Cluster_ID, Purpose: Purpose, Delete: Delete, Status: Status})
		} // appending deatils to the result
		rev_slc := []Asset[string]{}
		for i := range result {
			// reverse the order
			rev_slc = append(rev_slc, result[len(result)-1-i])
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"ListAsset": rev_slc, "Status Code": "200 OK", "Message": "Listing all assets"})
	})

	//--------------------------------------------------update asset details------------------------------------------------------
	mux.HandleFunc("/update_asset_details", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func UpdateAssetDetails(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var p Asset[int]
		Delete := p.Delete
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		_, err1 := db.Exec("UPDATE Asset SET BMC_Password=$2,Asset_location=$3,Updated_on=CURRENT_DATE,Updated_by=$4,Purpose=$5 WHERE Asset_ID=$1;", p.Asset_Id, p.BMC_Password, p.Asset_Location, p.Updated_by, p.Purpose)

		if err1 != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err1, "Status Code": "202 "})
			return
		}

		if Delete == 1 || Delete == 0 {
			_, err := db.Query(`INSERT into Historic_details (Asset_ID,Assigned_to,Assigned_from,Updated_on,Updated_by,Remarks)
            SELECT Asset_ID,Assigned_to,Assigned_from,Updated_on,Updated_by,'Asset_updated' FROM Asset where Asset_ID=$1`, p.Asset_Id)

			if err != nil {
				fmt.Println(err)
			}
			//fmt.Fprintf(w, "Record Updated!")
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Record Updated!", "Status Code": "200 OK"})

		} else {
			fmt.Println("No update is required")
		}
	})

	//----------------------------------------------Release server (updating Reserve table)------------------------
	mux.HandleFunc("/release_asset", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Release(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var p Asset[int]
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			panic(err.Error())
		}
		var reserved bool
		err = db.QueryRow("SELECT Reserved FROM Asset where Asset_ID=$1", p.Asset_Id).Scan(&reserved)
		if err != nil {
			fmt.Println(err)

		}
		if reserved {

			_, err = db.Exec("UPDATE Asset SET Reserved='false',Assigned_to=null,Assigned_by=null,Updated_on=CURRENT_DATE,Updated_by=$2 where Asset_ID=$1;", p.Asset_Id, p.Updated_by) // query for updating
			if err != nil {
				fmt.Println(err)

				http.Error(w, http.StatusText(500), http.StatusInternalServerError)
				return
			}

			_, err := db.Exec(`INSERT into Historic_details (Asset_ID,Assigned_to,Assigned_from,Updated_on,Updated_by,Remarks)
        SELECT Asset_ID,Assigned_to,Assigned_from,CURRENT_DATE,Updated_by,'Server Released' FROM Asset where Asset_ID=$1`, p.Asset_Id)

			if err != nil {
				fmt.Println(err)
			}

			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Server Released", "Status Code": "200 OK"})

		} else {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Server can't release", "Status Code": "400"})

		}
	})

	//------------------------------------------------------getmyasset--------------------------------------------------------
	mux.HandleFunc("/my_asset", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetAsset(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var p Asset[int]
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		rows, err := db.Query("SELECT * from Asset where Reserved ='Yes' AND Assigned_to = $1", p.Assigned_to)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "400 "})
			return
		}

		assets := []Asset[string]{}
		for rows.Next() {
			var Asset_ID, Assigned_to, Delete int
			var Assigned_from, Created_on, Updated_on time.Time
			var Asset_name, Manufacturer, BMC_IP, BMC_User, BMC_Password, Asset_location, Assigned_by, Created_by, Updated_by, OS_IP, OS_User, OS_Password, Purpose, Cluster_ID string
			var Status, Reserved bool
			err1 := rows.Scan(&Asset_ID, &Asset_name, &Manufacturer, &BMC_IP, &BMC_User, &BMC_Password, &Asset_location, &Reserved, &Assigned_to, &Assigned_from, &Assigned_by, &Created_on, &Created_by, &Updated_on, &Updated_by, &OS_IP, &OS_User, &OS_Password, &Purpose, &Cluster_ID, &Delete, &Status)
			if err1 != nil {
				log.Printf("Failed to build content from sql rows: %v \n", err1)
				return
			}
			marshal, _ := json.Marshal(assets)
			var c []Historic_details[string]
			var username []string
			var mail string
			var user string
			_ = json.Unmarshal(marshal, &c)
			err = db.QueryRow(" SELECT Email_ID FROM users where User_ID=$1;", Assigned_to).Scan(&mail)
			if err != nil {
				fmt.Println(err)
			}
			username = strings.Split(mail, "@")
			user = username[0]
			assets = append(assets, Asset[string]{Asset_Id: Asset_ID, Asset_Name: Asset_name, Manufacturer: Manufacturer, BMC_IP: BMC_IP, BMC_User: BMC_User, BMC_Password: BMC_Password, Asset_Location: Asset_location, Reserved: Reserved, Assigned_to: user, Assigned_from: Assigned_from, Assigned_by: Assigned_by, Created_on: Created_on, Created_by: Created_by, Updated_on: Updated_on, Updated_by: Updated_by, OS_IP: OS_IP, OS_User: OS_User, OS_Password: OS_Password, Purpose: Purpose, Cluster_Id: Cluster_ID, Delete: Delete, Status: Status})
		}
		rev_slc := []Asset[string]{}
		for i := range assets {
			// reverse the order
			rev_slc = append(rev_slc, assets[len(assets)-1-i])
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"ListAsset": rev_slc, "Status Code": "200 OK", "Message": "Listed specified assets"})

		if len(assets) == 0 {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "user not found", "Status Code": "404 "})
			return
		}
	})

	//-----------------------------------------------historic details-----------------------------------------------
	mux.HandleFunc("/historic_details", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func HistoricDetails(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		str := "SELECT Id, Asset_ID,COALESCE(Assigned_to, 0), COALESCE(Assigned_from, '0001-01-01'), COALESCE(Updated_on,'0001-01-01'), Updated_by, Remarks  FROM Historic_details"

		rows, err := db.Query(str)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "400 "})
			return
		}
		result := []Historic_details[string]{} // creating slice
		for rows.Next() {

			var Id, Asset_Id, Assigned_to int
			var Updated_by, Remarks string
			var Updated_on, Assigned_from time.Time

			err := rows.Scan(&Id, &Asset_Id, &Assigned_to, &Assigned_from, &Updated_on, &Updated_by, &Remarks)

			if err != nil {
				fmt.Println(err)
				log.Printf("Failed to build content from sql rows: %v\n", err)

			}
			marshal, _ := json.Marshal(result)
			var c []Historic_details[string]
			var username []string
			var user string
			var mail string
			_ = json.Unmarshal(marshal, &c)
			err = db.QueryRow(" SELECT Email_ID FROM users where User_ID=$1;", Assigned_to).Scan(&mail)
			if err != nil {
				fmt.Println(err)
			}
			username = strings.Split(mail, "@")
			user = username[0]
			result = append(result, Historic_details[string]{Id: Id, Asset_Id: Asset_Id, Assigned_to: user, Assigned_from: Assigned_from, Updated_on: Updated_on, Updated_by: Updated_by, Remarks: Remarks})
		}
		rev_slc := []Historic_details[string]{}
		for i := range result {
			// reverse the order
			rev_slc = append(rev_slc, result[len(result)-1-i])
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Historic_Details": rev_slc, "Status Code": "200 OK", "Message": "Listing Historic details"})
	})

	// -------------------------------------------------view users list---------------------------------------------------------------
	mux.HandleFunc("/view_users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func View_Role(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		//database connection using funcation
		rows, err := db.Query("SELECT User_ID, Email_ID, First_Name, Last_Name, Created_on, Created_by,COALESCE(Updated_on,'0001-01-01'),COALESCE(Updated_by, ''), Role, Teams from USERS where Delete=B'0'") // data selecting from user_table

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "400", "Message": err})

		}

		users := []userDetails{}
		for rows.Next() {
			var User_Id int
			var Email_Id, First_Name, Last_Name, Created_by, Updated_by, Role, Teams string
			var Created_on, Updated_on time.Time

			err = rows.Scan(&User_Id, &Email_Id, &First_Name, &Last_Name, &Created_on, &Created_by, &Updated_on, &Updated_by, &Role, &Teams)

			if err != nil {
				log.Printf("Failed to build content from sql rows: %v \n", err)
			}
			users = append(users, userDetails{User_Id: User_Id, Email_Id: Email_Id, First_Name: First_Name, Last_Name: Last_Name, Created_on: Created_on, Created_by: Created_by, Updated_on: Updated_on, Updated_by: Updated_by, Role: Role, Teams: Teams})

		}
		rev_slc := []userDetails{}
		for i := range users {
			// reverse the order
			rev_slc = append(rev_slc, users[len(users)-1-i])
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Listusers": rev_slc, "status code": " 200 Ok", "Message": "record found"})
	})

	//----------------------------------------------------- create user------------------------------------------------------------------
	mux.HandleFunc("/create_user", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Create_User(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var user userDetails
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Status Code": "400", "Message": "Invalid input syntax-email"})

			return
		}
		var User_Id int
		User_Id = 0
		var Email string
		User_Id = User_Id + 1
		err = db.QueryRow("SELECT Email_ID FROM Users where Email_ID=$1", user.Email_Id).Scan(&Email)
		if user.Email_Id == Email {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Status": "202", "Message": "Email already exists"})
			return
		} else {

			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)
			adduser := `insert into Users(Email_ID,Password,First_Name,Last_Name,Created_on,Created_by,Updated_on,Updated_by,Role,Teams,Delete) values ($1, $2, $3, $4,CURRENT_DATE, $5,CURRENT_DATE, $6, $7, $8,'0')`
			_, err = db.Exec(adduser, user.Email_Id, string(hashedPassword), user.First_Name, user.Last_Name, user.Created_by, user.Updated_by, user.Role, user.Teams)
			if err != nil {
				w.WriteHeader(http.StatusAccepted)
				json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
				return
			}
			json.NewEncoder(w).Encode(map[string]string{"Message": " User added succesfully!", "Status": "200 OK"})
		}
	})

	//------------------------------------------------ soft delete(1-not deleted,0-deleted)---------------------------------------------------
	mux.HandleFunc("/delete_user", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Delete_User(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var users userDetails
		err := json.NewDecoder(r.Body).Decode(&users)
		if err != nil {
			http.Error(w, err.Error(), http.StatusAccepted)
			return
		}
		rows, err := db.Query("SELECT User_ID, Email_ID,Password, First_Name, Last_Name, Created_on, Created_by,COALESCE(Updated_on,'0001-01-01'),COALESCE(Updated_by, ''), Role, Teams,Delete FROM USERS WHERE User_ID = $1", users.User_Id)
		User_ID := 0
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "400 "})
			return
		}

		for rows.Next() {
			err := rows.Scan(&users.User_Id, &users.Email_Id, &users.Password, &users.First_Name, &users.Last_Name, &users.Created_on, &users.Created_by, &users.Updated_on, &users.Updated_by, &users.Role, &users.Teams, &users.Delete)
			w.WriteHeader(http.StatusAccepted)
			if err != nil {
				w.WriteHeader(http.StatusAccepted)
				json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
				return
			}
			User_ID++
		}
		if User_ID == 0 {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "404", "Message": "user not found"})

		} else {
			rows, err := db.Query("UPDATE users SET delete = '1' WHERE user_id= $1", users.User_Id)
			if err != nil {
				w.WriteHeader(http.StatusAccepted)
				json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
				return
			}
			users := []userDetails{}
			for rows.Next() {
				var User_Id = 0
				var Email_Id, Password, Role, First_Name, Last_Name, Created_by, Updated_by, Teams string
				var Delete int
				var Created_on, Updated_on time.Time

				err = json.NewDecoder(r.Body).Decode(&users)
				if err != nil {
					w.WriteHeader(http.StatusAccepted)
					json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
					return
				}
				err = rows.Scan(&User_Id, &Email_Id, &Password, &First_Name, &Last_Name, &Created_on, &Created_by, &Updated_on, &Updated_by, &Role, &Teams, &Delete)
				if err != nil {
					log.Printf("Failed to build content from sql rows: %v \n", err)
				}
				users = append(users, userDetails{User_Id: User_Id, Email_Id: Email_Id, Password: Password, Role: Role, First_Name: First_Name, Last_Name: Last_Name, Created_on: Created_on, Created_by: Created_by, Updated_on: Updated_on, Updated_by: Updated_by, Teams: Teams, Delete: Delete})
				w.WriteHeader(http.StatusOK)
			}
			json.NewEncoder(w).Encode(map[string]string{"Message": "Deleted Successfully", "Status Code": "200 OK"})
		}
	})

	// ------------------------------------------------------------update user-----------------------------------------------------------------
	mux.HandleFunc("/update_users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func Update_User(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		var users userDetails
		err := json.NewDecoder(r.Body).Decode(&users)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "400 "})
			return
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(users.Password), 8)
		if err != nil {
			log.Printf("Failed to build content from sql rows: %v \n", err)
		}
		_, err = db.Exec("UPDATE users SET password=$2, first_name=$3, last_name=$4, updated_on=CURRENT_DATE, updated_by=$5,  role=$6, teams=$7 WHERE user_id=$1;", users.User_Id, string(hashedPassword), users.First_Name, users.Last_Name, users.Updated_by, users.Role, users.Teams)
		if err != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "200", "Message": "Record Updated!"})
	})

	//--------------------------------------------------------- List of request table ------------------------------------------------
	mux.HandleFunc("/list_request", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func ListRequest(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}

		rows, err := db.Query("SELECT Id,User_No,Creator,Start_Date,End_Date,Manufacturer,Number_Of_Servers,Operating_System,Cpu_model,CPU_Sockets,DIMM_Size,DIMM_Capacity,Storage_Vendor,Storage_Controller,Storage_Capacity,Network_Type,Network_speed,Number_Of_Network_Ports,Special_Switching_Needs,COALESCE(Infraadmin_Comments, Array[null]),COALESCE(User_Comments, Array[null]),COALESCE(Request, false) from Server_Request")

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "400", "Message": err})
			return
		}

		users := []Server_Request{}
		for rows.Next() {
			var Id, User_No int
			var Network_Type, Request bool

			var Creator, Manufacturer, Operating_System, Cpu_model, Number_Of_Servers, CPU_Sockets, Number_Of_Network_Ports, DIMM_Size, DIMM_Capacity, Storage_Vendor, Storage_Controller, Storage_Capacity, Network_speed, Infraadmin_Comments, User_Comments, Special_Switching_Needs string
			var Start_Date, End_Date time.Time

			err = rows.Scan(&Id, &User_No, &Creator, &Start_Date, &End_Date, &Manufacturer, &Number_Of_Servers, &Operating_System, &Cpu_model, &CPU_Sockets, &DIMM_Size, &DIMM_Capacity, &Storage_Vendor, &Storage_Controller, &Storage_Capacity, &Network_Type, &Network_speed, &Number_Of_Network_Ports, &Special_Switching_Needs, &Infraadmin_Comments, &User_Comments, &Request)

			if err != nil {
				w.WriteHeader(http.StatusAccepted)
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
				return
			}

			users = append(users, Server_Request{Id: Id, User_No: User_No, Creator: Creator, Start_Date: Start_Date, End_Date: End_Date, Manufacturer: Manufacturer, Number_Of_Servers: Number_Of_Servers, Operating_System: Operating_System, Cpu_model: Cpu_model, CPU_Sockets: CPU_Sockets, DIMM_Size: DIMM_Size, DIMM_Capacity: DIMM_Capacity, Storage_Vendor: Storage_Vendor, Storage_Controller: Storage_Controller, Storage_Capacity: Storage_Capacity, Network_Type: Network_Type, Network_speed: Network_speed, Number_Of_Network_Ports: Number_Of_Network_Ports, Special_Switching_Needs: Special_Switching_Needs, Infraadmin_Comments: Infraadmin_Comments, User_Comments: User_Comments, Request: Request})

		}
		rev_slc := []Server_Request{}
		for i := range users {
			// reverse the order
			rev_slc = append(rev_slc, users[len(users)-1-i])
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Listusers": rev_slc, "Status Code": "200 OK", "Message": "List of requests"})
	})

	//---------------------------------------------------Creating user Request-----------------------------------------------------------------
	mux.HandleFunc("/create_request", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func CreateRequest(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}

		var requests Server_Request
		var ID int
		ID = 0

		err := json.NewDecoder(r.Body).Decode(&v)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "400 Bad Request", "Message": err})
			return
		}

		err = db.QueryRow("Select ID from Server_Request where Id=$1", requests.Id).Scan(&ID)
		ID = ID + 1

		addStatement := `INSERT INTO Server_Request(User_No,Creator, Start_Date,End_Date,Manufacturer,Number_Of_Servers,Operating_System,Cpu_model,CPU_Sockets,DIMM_Size,DIMM_Capacity,Storage_Vendor,Storage_Controller,Storage_Capacity,Network_Type,Network_speed ,Number_Of_Network_Ports ,Special_Switching_Needs,Infraadmin_Comments, User_Comments, Request) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`
		_, err = db.Exec(addStatement, v.User_No, v.Creator, v.Start_Date.Format("2006-01-02"), v.End_Date.Format("2006-01-02"), v.Manufacturer, v.Number_Of_Servers, v.Operating_System, v.Cpu_model, v.CPU_Sockets, v.DIMM_Size, v.DIMM_Capacity, v.Storage_Vendor, v.Storage_Controller, v.Storage_Capacity, v.Network_Type, v.Network_speed, v.Number_Of_Network_Ports, v.Special_Switching_Needs, v.Infraadmin_Comments, v.User_Comments, v.Request)

		if err != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
			return
		}
		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "200 OK", "Message": "Request added successfully"})
	})

	//----------------------------------------------------update user request---------------------------------------------------
	mux.HandleFunc("/update_u_comments", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func UpdateUserComments(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		err := json.NewDecoder(r.Body).Decode(&v)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Status Code": "400", "Message": "Invalid input syntax"})

			return
		}
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]string{"Message": "method not found", "Status Code": "405"})
			return
		}
		currentTime := time.Now()

		_, err1 := db.Exec("UPDATE Server_Request SET User_No=$2,Creator=$3,Start_Date=$4,End_Date=$5,Manufacturer=$6,Number_Of_Servers=$7,Operating_System=$8,Cpu_model=$9,CPU_Sockets=$10,DIMM_Size=$11,DIMM_Capacity=$12,Storage_Vendor=$13,Storage_Controller=$14,Storage_Capacity=$15,Network_Type=$16,Network_speed=$17,Number_Of_Network_Ports=$18,Special_Switching_Needs=$19 Where ID=$1  ;", v.Id, v.User_No, v.Creator, v.Start_Date, v.End_Date, v.Manufacturer, v.Number_Of_Servers, v.Operating_System, v.Cpu_model, v.CPU_Sockets, v.DIMM_Size, v.DIMM_Capacity, v.Storage_Vendor, v.Storage_Controller, v.Storage_Capacity, v.Network_Type, v.Network_speed, v.Number_Of_Network_Ports, v.Special_Switching_Needs)

		if err1 != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err1, "Status Code": "202 "})
			return
		}

		_, err2 := db.Exec("UPDATE Server_Request SET User_Comments= array_prepend( $2, User_Comments)  where ID=$1;", v.Id, v.User_Comments+"@"+currentTime.Format("2006-01-02 15:04:05"))

		if err2 != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err2, "Status Code": "202 "})
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Record_updated!", "Status Code": "200 OK"})
	})

	//-------------------------------------------------update infra admin request--------------------------------------------
	mux.HandleFunc("/update_ia_comments", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func UpdateInfradminComments(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		err := json.NewDecoder(r.Body).Decode(&v)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]string{"Message": "method not found", "Status Code": "405"})
			return
		}

		currentTime := time.Now()

		_, err1 := db.Exec("UPDATE Server_Request SET Request=$2 where ID=$1;", v.Id, v.Request)
		if err1 != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err1, "Status Code": "202 "})
			return
		}

		_, err2 := db.Exec("UPDATE Server_Request SET Infraadmin_Comments= array_prepend( $2 , Infraadmin_Comments)  where ID=$1;", v.Id, v.Infraadmin_Comments+"@"+currentTime.Format("2006-01-02 15:04:05"))

		if err2 != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err2, "Status Code": "202 "})
			return
		}

		json.NewEncoder(w).Encode(map[string]interface{}{"Message": "Request Update!", "Status Code": "200 OK"})
	})

	//-----------------------------------------------------------GetMyRequest--------------------------------------------
	mux.HandleFunc("/my_request", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetMyRequest(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodPost {
			w.WriteHeader(405) // Return 405 Method Not Allowed.
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}
		p := Server_Request{}
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		rows, err := db.Query("SELECT * from Server_Request WHERE  User_No = $1", p.User_No)
		if err != nil {
			w.WriteHeader(http.StatusAccepted)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": err, "Status Code": "202 "})
			return
		}

		Requests := []Server_Request{}
		for rows.Next() {
			var Id, User_No int
			var Network_Type, Request bool
			var Creator, Manufacturer, Operating_System, Cpu_model, CPU_Sockets, Number_Of_Servers, DIMM_Size, DIMM_Capacity, Storage_Vendor, Storage_Controller, Storage_Capacity, Network_speed, Number_Of_Network_ports, Special_Switching_Needs, Infraadmin_Comments, User_Comments string
			var Start_Date, End_Date time.Time

			err1 := rows.Scan(&Id, &User_No, &Creator, &Start_Date, &End_Date, &Manufacturer, &Number_Of_Servers, &Operating_System, &Cpu_model, &CPU_Sockets, &DIMM_Size, &DIMM_Capacity, &Storage_Vendor, &Storage_Controller, &Storage_Capacity, &Network_Type, &Network_speed, &Number_Of_Network_ports, &Special_Switching_Needs, &Infraadmin_Comments, &User_Comments, &Request)
			if err1 != nil {
				log.Printf("Failed to build content from sql rows: %v \n", err1)
				return
			}

			Requests = append(Requests, Server_Request{Id: Id, User_No: User_No, Creator: Creator, Start_Date: Start_Date, End_Date: End_Date, Manufacturer: Manufacturer, Number_Of_Servers: Number_Of_Servers, Operating_System: Operating_System, Cpu_model: Cpu_model, CPU_Sockets: CPU_Sockets, DIMM_Size: DIMM_Size, DIMM_Capacity: DIMM_Capacity, Storage_Vendor: Storage_Vendor, Storage_Controller: Storage_Controller, Storage_Capacity: Storage_Capacity, Network_Type: Network_Type, Network_speed: Network_speed, Number_Of_Network_Ports: Number_Of_Network_ports, Special_Switching_Needs: Special_Switching_Needs, Infraadmin_Comments: Infraadmin_Comments, User_Comments: User_Comments, Request: Request})
		}
		rev_slc := []Server_Request{}
		for i := range Requests {
			// reverse the order
			fmt.Println("working")
			rev_slc = append(rev_slc, Requests[len(Requests)-1-i])
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"ListMyRequests": rev_slc, "Status Code": "200 OK", "Message": "Listed specified Requests"})

		if len(Requests) == 0 {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "No current Requests", "Status Code": "404"})
			return
		}
	})
	//----------------------infra_chat-------------
	mux.HandleFunc("/infra_chat", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetDashboard5(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}

		rows, err := db.Query("SELECT Id,COALESCE(Infraadmin_Comments, Array[null]) from Server_Request")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "400", "Message": err})
			return
		}

		chat := []Chat{}
		for rows.Next() {
			var Id int
			var Infraadmin_Comments string
			// var Comment string
			//var username []string
			err := rows.Scan(&Id, &Infraadmin_Comments)
			if err != nil {
				log.Fatal(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"status": "400 Bad Request", "Message": err})
			}

			var d []string

			fmt.Print(Infraadmin_Comments)
			//index := strings.Split(string(Infraadmin_Comments), ",")
			//d = append(d, index)
			d = []string{Infraadmin_Comments}

			chat = append(chat, Chat{Id: Id, Comment: d})
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"Infra_chat": chat, "Status": "200 OK"})

	})
	//----------------------user_chat-------------
	mux.HandleFunc("/user_chat", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,application/json ")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		//func GetDashboard5(w http.ResponseWriter, r *http.Request) {
		//SetupCORS(&w)
		if r.Method != http.MethodGet {
			w.WriteHeader(405)
			json.NewEncoder(w).Encode(map[string]interface{}{"Message": "method not found", "Status Code": "405 "})
			return
		}

		rows, err := db.Query("SELECT Id,COALESCE(User_Comments, Array[null]) from Server_Request")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Status Code": "400", "Message": err})
			return
		}

		chat := []Chat{}
		for rows.Next() {
			var Id int
			var User_Comments string
			// var Comment string
			//var username []string
			err := rows.Scan(&Id, &User_Comments)
			if err != nil {
				log.Fatal(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"status": "400 Bad Request", "Message": err})
			}

			var d []string

			fmt.Print(User_Comments)
			//index := strings.Split(string(Infraadmin_Comments), ",")
			//d = append(d, index)
			d = []string{User_Comments}

			chat = append(chat, Chat{Id: Id, Comment: d})
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"User_chat": chat, "Status": "200 OK"})

	})

	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":5002", handler)
}

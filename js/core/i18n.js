const languageKey = "busway:language";
const languages = new Set(["en", "zh-CN", "es"]);
const rows = `
Busway · Find Your Route|Busway · 查找您的路线|Busway · Encuentra tu ruta
Sign in · Busway|登录 · Busway|Iniciar sesión · Busway
Create account · Busway|创建账户 · Busway|Crear cuenta · Busway
Privacy, terms & help · Busway|隐私、条款与帮助 · Busway|Privacidad, condiciones y ayuda · Busway
Site information|网站信息|Información del sitio
Last updated: October 25, 2026|最后更新：2026年10月25日|Última actualización: 25 de octubre de 2026
Find your stop, your route and your times.|查找站点、路线和时间。|Encuentra tu parada, ruta y horarios.
Login|登录|Iniciar sesión
Register|注册|Registrarse
Back|返回|Atrás
Welcome back! Glad to see you, again!|欢迎回来！很高兴再次见到您！|¡Qué bueno verte de nuevo!
Email|电子邮箱|Correo electrónico
Enter your email|请输入电子邮箱|Ingresa tu correo electrónico
Password|密码|Contraseña
Enter your password|请输入密码|Ingresa tu contraseña
Forgot password?|忘记密码？|¿Olvidaste tu contraseña?
Or login with|或使用以下方式登录|O inicia sesión con
Continue with Google|使用 Google 继续|Continuar con Google
Verify your email|验证您的电子邮箱|Verifica tu correo electrónico
Check your inbox and open the verification link.|请查看收件箱并打开验证链接。|Revisa tu bandeja de entrada y abre el enlace de verificación.
Resend verification email|重新发送验证邮件|Reenviar correo de verificación
I've verified my email|我已验证邮箱|Ya verifiqué mi correo
Finish signing in|完成登录|Terminar de iniciar sesión
Confirm the email address your link was sent to.|请确认收到登录链接的电子邮箱地址。|Confirma el correo al que se envió el enlace.
Continue|继续|Continuar
Set a password|设置密码|Crear una contraseña
Set a password so you can sign in any time without waiting for another email. Already have one? Skip this step.|设置密码后，您无需等待邮件即可随时登录。已经有密码？可以跳过此步骤。|Crea una contraseña para iniciar sesión sin esperar otro correo. ¿Ya tienes una? Omite este paso.
At least 6 characters|至少 6 个字符|Al menos 6 caracteres
Save password and continue|保存密码并继续|Guardar contraseña y continuar
Skip for now|暂时跳过|Omitir por ahora
Don't have an account?|还没有账户？|¿No tienes una cuenta?
Register now|立即注册|Regístrate ahora
Who is signing up?|谁要注册？|¿Quién se está registrando?
Hello! Register to get started|您好！注册以开始使用|¡Hola! Regístrate para comenzar
I'm a student|我是学生|Soy estudiante
Sign up with your school email address.|使用您的学校邮箱注册。|Regístrate con tu correo escolar.
I'm a parent|我是家长|Soy padre, madre o tutor
Your student adds you first, then you sign up with the address they invited.|请先让您的学生添加您，然后使用收到邀请的邮箱注册。|Primero, tu estudiante debe agregarte. Después, regístrate con el correo invitado.
Create a password|创建密码|Crea una contraseña
Type it again|再次输入密码|Escríbela de nuevo
Confirm password|确认密码|Confirma la contraseña
Or register with|或使用以下方式注册|O regístrate con
Already have an account?|已经有账户？|¿Ya tienes una cuenta?
Login now|立即登录|Inicia sesión ahora
Your school|您的学校|Tu escuela
Select your school|选择您的学校|Selecciona tu escuela
Enter your address|请输入您的地址|Ingresa tu dirección
Address|地址|Dirección
Search address|搜索地址|Buscar dirección
Address suggestions|地址建议|Sugerencias de direcciones
Bus stops by school|按学校查看公交站点|Paradas de autobús por escuela
Enter your address and choose a school to pin its nearest bus stop. Hover over or tap any dot for routes, times and directions.|输入地址并选择学校，即可标出最近的公交站点。将鼠标悬停或点按地图上的点，查看路线、时间和导航。|Ingresa tu dirección y elige una escuela para marcar la parada más cercana. Pasa el cursor o toca un punto para ver rutas, horarios e indicaciones.
Switch to 2D|切换到二维视图|Cambiar a vista 2D
Switch to 3D|切换到三维视图|Cambiar a vista 3D
Language|语言|Idioma
Interactive map of Phoenix, Arizona|亚利桑那州凤凰城交互式地图|Mapa interactivo de Phoenix, Arizona
Parent access|家长访问权限|Acceso para padres
Parent invites|家长邀请|Invitaciones para padres
Close|关闭|Cerrar
Parents do not have a school email, so add them here. They get an invite email with a sign-in link, and once they open it they can set a password and sign in whenever they like.|家长没有学校邮箱，请在此添加。家长会收到包含登录链接的邀请邮件，打开链接后即可设置密码并随时登录。|Los padres no tienen correo escolar, así que agrégalos aquí. Recibirán una invitación con un enlace para iniciar sesión y crear una contraseña.
Parent email|家长邮箱|Correo del padre, madre o tutor
Send invite|发送邀请|Enviar invitación
Privacy Policy|隐私政策|Política de privacidad
Terms of Use|使用条款|Términos de uso
Accessibility|无障碍访问|Accesibilidad
Contact|联系我们|Contacto
District website|学区网站|Sitio web del distrito
Help / FAQ|帮助 / 常见问题|Ayuda / Preguntas frecuentes
Sending your sign-in link...|正在发送登录链接…|Enviando el enlace para iniciar sesión…
The map failed to load. Refresh the page and try again.|地图加载失败。请刷新页面后重试。|No se pudo cargar el mapa. Actualiza la página e inténtalo de nuevo.
Unable to sign out. Please try again.|无法退出登录，请重试。|No se pudo cerrar la sesión. Inténtalo de nuevo.
That email address does not look right.|此邮箱地址似乎无效。|Ese correo electrónico no parece válido.
Firestore refused this action. Check that firestore.rules has been published and that your account has permission.|Firestore 拒绝了此操作。请确认 firestore.rules 已发布且您的账户有权限。|Firestore rechazó esta acción. Comprueba que firestore.rules esté publicado y que tu cuenta tenga permiso.
Could not reach Firestore. Check that Firestore is enabled for this Firebase project.|无法连接 Firestore。请确认此 Firebase 项目已启用 Firestore。|No se pudo conectar con Firestore. Comprueba que esté habilitado en este proyecto de Firebase.
Opening Google sign-in...|正在打开 Google 登录…|Abriendo el inicio de sesión de Google…
Opening Google sign-up...|正在打开 Google 注册…|Abriendo el registro de Google…
Email verified!|邮箱已验证！|¡Correo verificado!
Your email is not verified yet. Check your inbox.|邮箱尚未验证，请查看收件箱。|Aún no se verificó tu correo. Revisa tu bandeja.
Unable to check verification. Please try again.|无法检查验证状态，请重试。|No se pudo comprobar la verificación. Inténtalo de nuevo.
Unable to check your account. Please try again.|无法检查您的账户，请重试。|No se pudo verificar tu cuenta. Inténtalo de nuevo.
. This site does not currently load a Google Analytics SDK.|。本网站目前未加载 Google Analytics SDK。|. Este sitio no carga actualmente el SDK de Google Analytics.
Back to map|返回地图|Volver al mapa
Information you provide|您提供的信息|Información que proporcionas
Service providers and technical data|服务提供商和技术数据|Proveedores de servicios y datos técnicos
How information is used and retained|信息的使用与保留|Uso y conservación de la información
Children and location searches|儿童与位置搜索|Menores y búsquedas de ubicación
Questions or privacy requests:|如有疑问或隐私请求：|Preguntas o solicitudes de privacidad:
How do I find a bus stop?|如何查找公交站点？|¿Cómo encuentro una parada de autobús?
Are walking directions the school bus route?|步行路线是校车路线吗？|¿Las indicaciones a pie son la ruta del autobús escolar?
How does a parent get access?|家长如何获得访问权限？|¿Cómo obtiene acceso un padre o tutor?
Where can I get more help?|还可以在哪里获得帮助？|¿Dónde puedo obtener más ayuda?
Student|学生|Estudiante
Parent|家长|Padre/madre
Admin|管理员|Administrador
Resend|重新发送|Reenviar
Remove access|移除访问权限|Quitar acceso
Cancel invite|取消邀请|Cancelar invitación
Unknown student|未知学生|Estudiante desconocido
No parent invites found.|未找到家长邀请。|No se encontraron invitaciones para padres.
No parents added yet.|尚未添加家长。|Aún no se agregaron padres.
Manage parent invites|管理家长邀请|Administrar invitaciones para padres
Route|路线|Ruta
AM leaves|上午发车|Salida por la mañana
PM arrives|下午到达|Llegada por la tarde
Approximate location — only the street could be matched.|位置为近似值——只能匹配到街道。|Ubicación aproximada: solo se pudo encontrar la calle.
Nearest stop|最近的站点|Parada más cercana
Get directions|获取路线|Cómo llegar
School|学校|Escuela
Finding address…|正在查找地址…|Buscando dirección…
Enter an address to search.|请输入要搜索的地址。|Ingresa una dirección para buscar.
No matching address found in Arizona. Check the address and try again.|在亚利桑那州未找到匹配地址。请检查后重试。|No se encontró esa dirección en Arizona. Revísala e inténtalo de nuevo.
Enter an address located in Arizona.|请输入亚利桑那州内的地址。|Ingresa una dirección ubicada en Arizona.
Unable to find that address. Please try again.|无法查找该地址，请重试。|No se pudo encontrar la dirección. Inténtalo de nuevo.
Enter your address to find the nearest bus stop.|请输入您的地址以查找最近的公交站点。|Ingresa tu dirección para encontrar la parada más cercana.
Arizona suggestions unavailable. Press Enter to search the address.|无法获取亚利桑那州地址建议。按 Enter 搜索地址。|No hay sugerencias de Arizona disponibles. Presiona Enter para buscar.
Verify your email before accessing the map.|请先验证邮箱，然后再访问地图。|Verifica tu correo antes de acceder al mapa.
Signing in...|正在登录…|Iniciando sesión…
Signing you in...|正在为您登录…|Iniciando tu sesión…
Creating your account...|正在创建账户…|Creando tu cuenta…
Saving your password...|正在保存密码…|Guardando tu contraseña…
Password saved.|密码已保存。|Contraseña guardada.
Use at least 6 characters.|密码至少需要 6 个字符。|Usa al menos 6 caracteres.
The two passwords do not match.|两次输入的密码不一致。|Las contraseñas no coinciden.
Your session expired. Please open your sign-in link again.|会话已过期。请重新打开登录链接。|Tu sesión venció. Abre de nuevo el enlace para iniciar sesión.
Please sign in again to resend the verification email.|请重新登录以再次发送验证邮件。|Inicia sesión de nuevo para reenviar el correo de verificación.
Verification email sent. Check your inbox.|验证邮件已发送，请查看收件箱。|Se envió el correo de verificación. Revisa tu bandeja.
Email verified!|邮箱已验证！|¡Correo verificado!
Your email is not verified yet. Check your inbox.|邮箱尚未验证，请查看收件箱。|Aún no se verificó tu correo. Revisa tu bandeja.
Unable to check verification. Please try again.|无法检查验证状态，请重试。|No se pudo comprobar la verificación. Inténtalo de nuevo.
Unable to check your account. Please try again.|无法检查您的账户，请重试。|No se pudo verificar tu cuenta. Inténtalo de nuevo.
This page needs a web server.|此页面需要通过 Web 服务器打开。|Esta página necesita un servidor web.
Busway helps Tempe Union families find bus stops and view schedule information. This policy describes information handled by this site.|Busway 帮助 Tempe Union 家庭查找公交站点和查看时刻表信息。本政策说明本网站处理的信息。|Busway ayuda a las familias de Tempe Union a encontrar paradas y consultar horarios. Esta política describe la información que maneja el sitio.
When you create an account or sign in, Firebase Authentication processes your email address and account credentials. Google sign-in also involves Google.|创建账户或登录时，Firebase Authentication 会处理您的电子邮箱和账户凭据。使用 Google 登录时，Google 也会处理相关信息。|Al crear una cuenta o iniciar sesión, Firebase Authentication procesa tu correo y las credenciales de tu cuenta. Google también participa si inicias sesión con Google.
Students who invite a parent provide the parent's email address. The invite record contains the student and parent email addresses, invite status, and sign-in/acceptance timestamps.|学生邀请家长时会提供家长的电子邮箱。邀请记录包含学生和家长的邮箱、邀请状态以及登录/接受邀请的时间。|Cuando un estudiante invita a un padre o tutor, proporciona su correo. El registro incluye ambos correos, el estado de la invitación y las fechas de inicio de sesión y aceptación.
Address searches are sent to Mapbox to find a location and, if a school is selected, request walking directions. The address and search results are held in the page while you use it; Busway does not save searched addresses in its Firestore database.|地址搜索会发送给 Mapbox 以查找位置；如果选择了学校，还会请求步行路线。使用期间，地址和搜索结果仅保留在页面中；Busway 不会将搜索地址保存到 Firestore 数据库。|Las búsquedas se envían a Mapbox para encontrar una ubicación y, si eliges una escuela, solicitar indicaciones a pie. La dirección y los resultados permanecen en la página mientras la usas; Busway no guarda las direcciones en Firestore.
The site uses Firebase Authentication and Firestore, Mapbox for maps, geocoding and directions, and a content delivery network for Web Awesome on account pages. These providers receive the technical information needed to deliver their services, such as your IP address and requests made by your browser. Their handling of information is governed by their own privacy policies, including the|本网站使用 Firebase Authentication 和 Firestore、Mapbox 地图/地理编码/路线服务，以及账户页面所用的 Web Awesome 内容分发网络。这些服务提供商会接收提供服务所需的技术信息，例如您的 IP 地址和浏览器请求。其信息处理方式受各自隐私政策约束，包括|El sitio usa Firebase Authentication y Firestore, Mapbox para mapas, geocodificación e indicaciones, y una red de distribución para Web Awesome. Estos proveedores reciben datos técnicos necesarios, como tu IP y las solicitudes del navegador. El manejo de datos se rige por sus propias políticas, incluidas las
Account information is used to authenticate users and decide student or parent access. Invite records remain in Firestore until the student or an authorized administrator removes them. Firebase account data is retained by Firebase according to the project's configuration and provider terms. Contact us to request help with account or information deletion.|账户信息用于验证用户身份并确定学生或家长的访问权限。邀请记录会保留在 Firestore 中，直到学生或授权管理员将其删除。Firebase 会根据项目配置和服务条款保留账户数据。如需删除账户或信息方面的帮助，请联系我们。|La información de la cuenta se usa para autenticar usuarios y determinar el acceso. Las invitaciones permanecen en Firestore hasta que el estudiante o un administrador autorizado las elimine. Firebase conserva los datos según la configuración del proyecto y sus condiciones. Contáctanos para solicitar ayuda con la eliminación de datos.
The site is intended for students and their families. Do not enter another person's home address without permission. Address searches are transmitted to Mapbox; review Mapbox's privacy policy before using that feature.|本网站面向学生及其家庭。未经许可，请勿输入他人的家庭住址。地址搜索会发送给 Mapbox；使用前请查看 Mapbox 的隐私政策。|Este sitio está destinado a estudiantes y sus familias. No ingreses la dirección de otra persona sin permiso. Las búsquedas se envían a Mapbox; consulta su política de privacidad.
Busway is provided to help families explore Tempe Union bus stops and schedule information. Use it lawfully and only with addresses you are permitted to use.|Busway 旨在帮助家庭查询 Tempe Union 公交站点和时刻表信息。请合法使用本网站，并仅使用您有权使用的地址。|Busway ayuda a las familias a consultar paradas y horarios de Tempe Union. Úsalo legalmente y solo con direcciones que tengas permiso para utilizar.
Stop locations, schedules, geocoding, and walking directions may be incomplete, approximate, delayed, or out of date. Walking directions are not school-bus routes. Confirm bus details with the district and use your own judgment when travelling; do not rely on this site for safety-critical or time-sensitive decisions.|站点位置、时刻表、地理编码和步行路线可能不完整、仅为近似值、延迟或过时。步行路线不是校车路线。请向学区确认公交信息，并在出行时自行判断；请勿将本网站用于涉及安全或时效的重要决策。|Las ubicaciones, horarios, geocodificación e indicaciones a pie pueden ser incompletos, aproximados o estar desactualizados. Las indicaciones a pie no son rutas de autobús escolar. Confirma la información con el distrito y no dependas de este sitio para decisiones urgentes o de seguridad.
The map, address lookup, and authentication features depend on third-party services and may be unavailable. Use of those services is subject to their terms. The site is provided “as is” to the extent permitted by law.|地图、地址查询和身份验证功能依赖第三方服务，可能无法使用。使用这些服务须遵守其条款。在法律允许的范围内，本网站按“现状”提供。|El mapa, la búsqueda de direcciones y la autenticación dependen de servicios externos y podrían no estar disponibles. Su uso está sujeto a sus condiciones. En la medida permitida por la ley, el sitio se ofrece «tal cual».
We aim to make Busway usable with keyboard navigation, visible focus indicators, labels, and screen-reader status messages. Some interactive map features may not be fully accessible.|我们致力于让 Busway 支持键盘导航、可见焦点指示、标签和屏幕阅读器状态消息。部分交互式地图功能可能无法完全满足无障碍需求。|Buscamos que Busway se pueda usar con teclado, indicadores de foco visibles, etiquetas y mensajes para lectores de pantalla. Algunas funciones del mapa podrían no ser totalmente accesibles.
Enter an Arizona address, choose your school, and select an address suggestion or submit the search. Busway marks the closest mapped stop for that school and may show a walking route to the address.|输入亚利桑那州的地址，选择学校，然后选择地址建议或提交搜索。Busway 会标出该学校最近的已标注站点，并可能显示前往该地址的步行路线。|Ingresa una dirección de Arizona, elige tu escuela y selecciona una sugerencia o envía la búsqueda. Busway marca la parada registrada más cercana y puede mostrar una ruta a pie.
No. Walking directions only connect the selected stop and searched address. Confirm school bus schedules and route information with the district.|不是。步行路线仅连接所选站点和搜索地址。请向学区确认校车时刻表和路线信息。|No. Las indicaciones a pie solo conectan la parada seleccionada con la dirección. Confirma horarios y rutas con el distrito.
A student signs in, opens Parent access, and invites the parent's email. The parent then signs in with that invited address.|学生登录后打开“家长访问权限”，并邀请家长的邮箱。家长随后使用收到邀请的邮箱登录。|El estudiante inicia sesión, abre «Acceso para padres» e invita el correo del padre o tutor. Luego, esa persona inicia sesión con el correo invitado.
This site is for students with a school email and the parents they invite. Ask your student to add you from their account.|本网站面向使用学校邮箱的学生及其邀请的家长。请让您的学生从其账户中添加您。|Este sitio es para estudiantes con correo escolar y los padres o tutores que inviten. Pídele a tu estudiante que te agregue.
Use your school email address so we can tell which school you are at.|请使用您的学校邮箱，以便我们了解您就读的学校。|Usa tu correo escolar para que sepamos a qué escuela asistes.
Use the address your student invited. That invite is what lets you in, so a different address will not work.|请使用学生邀请的邮箱。该邀请用于授予访问权限，其他邮箱无法使用。|Usa el correo que invitó tu estudiante. La invitación otorga acceso; otro correo no funcionará.
You were invited by your student. Open the link in your invite email to join, then set a password so you can sign in any time.|您的学生邀请了您。请打开邀请邮件中的链接加入，然后设置密码以便随时登录。|Tu estudiante te invitó. Abre el enlace del correo para unirte y luego crea una contraseña para iniciar sesión cuando quieras.
That email does not match the invite. Check the address and try again.|此邮箱与邀请不匹配。请检查邮箱后重试。|Ese correo no coincide con la invitación. Revísalo e inténtalo de nuevo.
That sign-in link has expired or was already used. Enter the invited email above and ask for a new link.|此登录链接已过期或已使用。请在上方输入受邀邮箱并申请新链接。|Ese enlace venció o ya se usó. Ingresa arriba el correo invitado y solicita un enlace nuevo.
Enter the email address your invite was sent to.|请输入收到邀请的邮箱地址。|Ingresa el correo que recibió la invitación.
You are signed in. Set a password to make it quicker next time.|您已登录。设置密码可让下次登录更快捷。|Iniciaste sesión. Crea una contraseña para que sea más rápido la próxima vez.
For security, open your sign-in link again before setting a password.|出于安全考虑，请重新打开登录链接后再设置密码。|Por seguridad, vuelve a abrir tu enlace antes de crear una contraseña.
Opening Google sign-in...|正在打开 Google 登录…|Abriendo el inicio de sesión de Google…
Opening Google sign-up...|正在打开 Google 注册…|Abriendo el registro de Google…
That does not look like an email address.|请输入有效的电子邮箱地址。|Ese correo electrónico no parece válido.
An account already exists for that email. Sign in instead.|该邮箱已有账户，请直接登录。|Ya existe una cuenta con ese correo. Inicia sesión.
Pick a password of at least 6 characters.|密码至少需要 6 个字符。|Elige una contraseña de al menos 6 caracteres.
Too many attempts. Wait a minute and try again.|尝试次数过多，请稍等片刻再试。|Demasiados intentos. Espera un minuto e inténtalo de nuevo.
The Google window closed before sign-in finished.|Google 窗口在登录完成前已关闭。|La ventana de Google se cerró antes de terminar.
No connection to the server. Check your internet and try again.|无法连接服务器。请检查网络后重试。|No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.
Email could not be sent right now. Please try again later.|目前无法发送邮件，请稍后重试。|No se pudo enviar el correo. Inténtalo más tarde.
That email and password do not match an account. Check them, or create an account if you have not made one yet.|邮箱和密码与账户不匹配。请检查信息，或创建新账户。|El correo y la contraseña no coinciden con una cuenta. Revísalos o crea una cuenta.
The two passwords do not match.|两次输入的密码不一致。|Las contraseñas no coinciden.
Password saved.|密码已保存。|Contraseña guardada.
No parents added yet.|尚未添加家长。|Aún no se agregaron padres.
No parent invites found.|未找到家长邀请。|No se encontraron invitaciones para padres.
No mapped bus stops found for this school.|未找到该学校的已标注公交站点。|No se encontraron paradas registradas para esta escuela.
Mapbox public access token|Mapbox 公共访问令牌|Token de acceso público de Mapbox
The Mapbox public access token is configured in the mapbox-access-token meta tag in index.html. The token needs Mapbox GL JS, Search JS, and Geocoding API access.|Mapbox 公共访问令牌配置在 index.html 的 mapbox-access-token 元标签中。该令牌需要 Mapbox GL JS、Search JS 和 Geocoding API 的访问权限。|El token público de Mapbox está configurado en la etiqueta meta mapbox-access-token de index.html. Necesita acceso a Mapbox GL JS, Search JS y Geocoding API.
 . This site does not currently load a Google Analytics SDK.|。本网站目前未加载 Google Analytics SDK。|. Este sitio no carga actualmente el SDK de Google Analytics.
Language|语言|Idioma
Sign out|退出登录|Cerrar sesión
Back to map|返回地图|Volver al mapa
Busway map|Busway 地图|Mapa de Busway
Busway - your school, your route.|Busway - 您的学校，您的路线。|Busway: tu escuela, tu ruta.
Information you provide|您提供的信息|Información que proporcionas
Mapbox Privacy Policy|Mapbox 隐私政策|Política de privacidad de Mapbox
Firebase privacy information|Firebase 隐私信息|Información de privacidad de Firebase
This site does not currently load a Google Analytics SDK.|本网站目前未加载 Google Analytics SDK。|Este sitio no carga actualmente el SDK de Google Analytics.
Review invites across all students, resend pending invitations, or revoke access.|查看所有学生的邀请、重新发送待处理的邀请或撤销访问权限。|Revisa invitaciones de todos los estudiantes, reenvía las pendientes o revoca el acceso.
Enter your parent's email address.|请输入您家长的邮箱地址。|Ingresa el correo de tu padre o tutor.
That is your own address. Use your parent's email.|这是您自己的邮箱。请使用您家长的邮箱。|Esa es tu propia dirección. Usa el correo de tu padre o tutor.
Could not load parent invites. Please try again.|无法加载家长邀请，请重试。|No se pudieron cargar las invitaciones. Inténtalo de nuevo.
Could not load your parents. Please try again.|无法加载您的家长，请重试。|No se pudieron cargar tus padres o tutores. Inténtalo de nuevo.
Could not remove that parent. Please try again.|无法移除该家长，请重试。|No se pudo quitar el acceso de esa persona. Inténtalo de nuevo.
Pending|待处理|Pendiente
Active|已启用|Activo
Invited|已邀请|Invitado
Joined|已加入|Se unió
Invite sent|邀请已发送|Invitación enviada
The site is available as a static page, but must be served over HTTP.|本网站是静态网页，但必须通过 HTTP 访问。|Este sitio es estático, pero debe servirse por HTTP.
This page needs a web server.|此页面需要通过 Web 服务器打开。|Esta página necesita un servidor web.
Accessibility|无障碍访问|Accesibilidad
Terms of Use|使用条款|Términos de uso
Privacy Policy|隐私政策|Política de privacidad
Contact|联系我们|Contacto
Help / FAQ|帮助 / 常见问题|Ayuda / Preguntas frecuentes
District website|学区网站|Sitio web del distrito
Questions or privacy requests:|如有疑问或隐私请求：|Preguntas o solicitudes de privacidad:
and|和|y
or visit the|或访问|o visita el
with questions about these terms.|如对这些条款有疑问，请联系我们。|si tienes preguntas sobre estas condiciones.
If you encounter an accessibility barrier or need information in another format, contact|如果您遇到无障碍障碍或需要其他格式的信息，请联系|Si encuentras una barrera de accesibilidad o necesitas información en otro formato, comunícate con
and describe the page and issue.|并说明页面和遇到的问题。|y describe la página y el problema.
Email|电子邮箱|Correo electrónico
Sign out|退出登录|Cerrar sesión
Sign up with your school email address.|使用您的学校邮箱注册。|Regístrate con tu correo escolar.
Use your school email address so we can tell which school you are at.|请使用您的学校邮箱，以便我们了解您就读的学校。|Usa tu correo escolar para que sepamos a qué escuela asistes.
Use the address your student invited. That invite is what lets you in, so a different address will not work.|请使用学生邀请的邮箱。该邀请用于授予访问权限，其他邮箱无法使用。|Usa el correo que invitó tu estudiante. La invitación otorga acceso; otro correo no funcionará.
Busway - your school, your route.|Busway - 您的学校，您的路线。|Busway: tu escuela, tu ruta.
Busway map|Busway 地图|Mapa de Busway
Tempe Union district website|Tempe Union 学区网站|Sitio web del distrito Tempe Union
Information you provide|您提供的信息|Información que proporcionas
Mapbox Privacy Policy|Mapbox 隐私政策|Política de privacidad de Mapbox
Firebase privacy information|Firebase 隐私信息|Información de privacidad de Firebase
This site does not currently load a Google Analytics SDK.|本网站目前未加载 Google Analytics SDK。|Este sitio no carga actualmente el SDK de Google Analytics.
Review invites across all students, resend pending invitations, or revoke access.|查看所有学生的邀请、重新发送待处理的邀请或撤销访问权限。|Revisa invitaciones de todos los estudiantes, reenvía las pendientes o revoca el acceso.
Enter your parent's email address.|请输入您家长的邮箱地址。|Ingresa el correo de tu padre o tutor.
That is your own address. Use your parent's email.|这是您自己的邮箱。请使用您家长的邮箱。|Esa es tu propia dirección. Usa el correo de tu padre o tutor.
Pending|待处理|Pendiente
Active|已启用|Activo
Invited|已邀请|Invitado
Could not load parent invites. Please try again.|无法加载家长邀请，请重试。|No se pudieron cargar las invitaciones. Inténtalo de nuevo.
Could not load your parents. Please try again.|无法加载您的家长，请重试。|No se pudieron cargar tus padres o tutores. Inténtalo de nuevo.
Could not remove that parent. Please try again.|无法移除该家长，请重试。|No se pudo quitar el acceso de esa persona. Inténtalo de nuevo.
Email|电子邮箱|Correo electrónico
Account created, but the verification email could not be sent.|账户已创建，但无法发送验证邮件。|Se creó la cuenta, pero no se pudo enviar el correo de verificación.
Account created. The verification email could not be sent right now - try Resend in a little while.|账户已创建。目前无法发送验证邮件，请稍后点击“重新发送”。|Se creó la cuenta, pero no se pudo enviar el correo de verificación. Intenta reenviarlo más tarde.
Contact with questions about these terms.|如对这些条款有疑问，请联系我们。|Contáctanos si tienes preguntas sobre estas condiciones.
If you encounter an accessibility barrier or need information in another format, contact|如果您遇到无障碍障碍或需要其他格式的信息，请联系|Si encuentras una barrera de accesibilidad o necesitas información en otro formato, comunícate con
and describe the page and issue.|并说明页面和遇到的问题。|y describe la página y el problema.
`.trim().split("\n").map(row => row.split("|"));

const dictionary = Object.fromEntries(
    rows.map(([english, chinese, spanish]) => [
        english,
        { "zh-CN": chinese, es: spanish }
    ])
);
const nodeSources = new WeakMap();
const attributeSources = new WeakMap();
let language = "en";

function normalize(value) {
    return value.replace(/\s+/g, " ").trim();
}

function translate(value) {
    const key = normalize(value);
    let result = dictionary[key]?.[language];
    let match;

    if (result) return result;
    if (language === "en") return value;

    const patterns = language === "zh-CN" ? [
        [/^(\d+) stops · (\d+) routes$/, m => `${m[1]} 个站点 · ${m[2]} 条路线`],
        [/^Sign-in link sent to (.+)\. Open it on any device and you can set a new password\.$/, m => `登录链接已发送至 ${m[1]}。您可以在任何设备上打开链接并设置新密码。`],
        [/^The email to (.+) could not be sent.*$/, m => `无法向 ${m[1]} 发送邮件。请稍后重试。`],
        [/^Sending another invite to (.+)…$/, m => `正在向 ${m[1]} 重新发送邀请…`],
        [/^Invite resent to (.+)\.$/, m => `已向 ${m[1]} 重新发送邀请。`],
        [/^Removing (.+)…$/, m => `正在移除 ${m[1]}…`],
        [/^(.+) no longer has access\.$/, m => `${m[1]} 已无法访问。`],
        [/^Inviting (.+)…$/, m => `正在邀请 ${m[1]}…`],
        [/^Invite sent to (.+)\. They can sign in as soon as they open it\.$/, m => `邀请已发送至 ${m[1]}。对方打开后即可登录。`],
        [/^(.+) was already added, so we sent the invite again\.$/, m => `${m[1]} 已添加，因此我们重新发送了邀请。`],
        [/^(Joined|Invite sent)( · .+)?$/, m => `${m[1] === "Joined" ? "已加入" : "邀请已发送"}${m[2] || ""}`],
        [/^Remove (.+)\? They will not be able to sign in any more\.$/, m => `移除 ${m[1]}？对方将无法再登录。`],
        [/^(.+) has been added and can sign in\. The invite email could not be sent - the project's daily email limit is used up\. To get in without the email: open the Create account page \(signup\.html\), enter this address and pick a password\.$/, m => `${m[1]} 已添加并可登录。邀请邮件无法发送，因为项目每日邮件额度已用完。如需不通过邮件登录，请打开注册页面，输入此邮箱并设置密码。`],
        [/^(.+) has been added and can sign in\. The invite email could not be sent \(.+\)\. To get in without the email: open the Create account page \(signup\.html\), enter this address and pick a password\.$/, m => `${m[1]} 已添加并可登录，但邀请邮件无法发送。如需不通过邮件登录，请打开注册页面，输入此邮箱并设置密码。`],
        [/^Nearest (.+) bus stop: (.+) \(([\d.]+) mi away\)\.$/, m => `距离您最近的${m[1]}公交站：${m[2]}（${m[3]} 英里）。`],
        [/^Nearest (.+) bus stop$/, m => `距离您最近的${m[1]}公交站`],
        [/^([\d.]+) mi from your address$/, m => `距离您的地址 ${m[1]} 英里`],
        [/^Walking route from the nearest (.+) stop \((.+)\) to your address: ([\d.]+) mi, about (\d+) min\.$/, m => `从最近的${m[1]}站点（${m[2]}）步行至您的地址：${m[3]} 英里，约 ${m[4]} 分钟。`],
        [/^Found (.+), but no walking route to the address is available\.$/, m => `已找到 ${m[1]}，但没有前往该地址的步行路线。`],
        [/^Found (.+), but walking directions could not be loaded\..*$/, m => `已找到 ${m[1]}，但无法加载步行路线。请检查 Mapbox 令牌设置。`],
        [/^Pin added for (.+)\.$/, m => `已标记：${m[1]}。`],
        [/^No mapped bus stops found for (.+)\.$/, m => `未找到 ${m[1]} 的已标注公交站点。`],
        [/^Sending another invite to (.+)…$/, m => `正在向 ${m[1]} 重新发送邀请…`],
        [/^Invite resent to (.+)\.$/, m => `已向 ${m[1]} 重新发送邀请。`],
        [/^Removing (.+)…$/, m => `正在移除 ${m[1]}…`],
        [/^(.+) no longer has access\.$/, m => `${m[1]} 已无法访问。`],
        [/^Inviting (.+)…$/, m => `正在邀请 ${m[1]}…`],
        [/^Invite sent to (.+)\. They can sign in as soon as they open it\.$/, m => `邀请已发送至 ${m[1]}。对方打开后即可登录。`],
        [/^(.+) was already added, so we sent the invite again\.$/, m => `${m[1]} 已添加，因此我们重新发送了邀请。`]
    ] : [
        [/^(\d+) stops · (\d+) routes$/, m => `${m[1]} paradas · ${m[2]} rutas`],
        [/^Sign-in link sent to (.+)\. Open it on any device and you can set a new password\.$/, m => `Se envió el enlace a ${m[1]}. Ábrelo en cualquier dispositivo para crear una contraseña.`],
        [/^The email to (.+) could not be sent.*$/, m => `No se pudo enviar el correo a ${m[1]}. Inténtalo más tarde.`],
        [/^Sending another invite to (.+)…$/, m => `Reenviando invitación a ${m[1]}…`],
        [/^Invite resent to (.+)\.$/, m => `Se reenvió la invitación a ${m[1]}.`],
        [/^Removing (.+)…$/, m => `Quitando el acceso de ${m[1]}…`],
        [/^(.+) no longer has access\.$/, m => `${m[1]} ya no tiene acceso.`],
        [/^Inviting (.+)…$/, m => `Invitando a ${m[1]}…`],
        [/^Invite sent to (.+)\. They can sign in as soon as they open it\.$/, m => `Se envió la invitación a ${m[1]}. Podrá iniciar sesión al abrirla.`],
        [/^(.+) was already added, so we sent the invite again\.$/, m => `${m[1]} ya estaba agregado; reenviamos la invitación.`],
        [/^(Joined|Invite sent)( · .+)?$/, m => `${m[1] === "Joined" ? "Se unió" : "Invitación enviada"}${m[2] || ""}`],
        [/^Remove (.+)\? They will not be able to sign in any more\.$/, m => `¿Quitar a ${m[1]}? Ya no podrá iniciar sesión.`],
        [/^(.+) has been added and can sign in\. The invite email could not be sent - the project's daily email limit is used up\. To get in without the email: open the Create account page \(signup\.html\), enter this address and pick a password\.$/, m => `${m[1]} se agregó y puede iniciar sesión. No se pudo enviar la invitación porque se agotó el límite diario de correo. Para acceder sin el correo, abre la página de registro, ingresa esta dirección y crea una contraseña.`],
        [/^(.+) has been added and can sign in\. The invite email could not be sent \(.+\)\. To get in without the email: open the Create account page \(signup\.html\), enter this address and pick a password\.$/, m => `${m[1]} se agregó y puede iniciar sesión, pero no se pudo enviar la invitación. Para acceder sin el correo, abre la página de registro, ingresa esta dirección y crea una contraseña.`],
        [/^Nearest (.+) bus stop: (.+) \(([\d.]+) mi away\)\.$/, m => `Parada más cercana de ${m[1]}: ${m[2]} (${m[3]} mi).`],
        [/^Nearest (.+) bus stop$/, m => `Parada más cercana de ${m[1]}`],
        [/^([\d.]+) mi from your address$/, m => `${m[1]} mi desde tu dirección`],
        [/^Walking route from the nearest (.+) stop \((.+)\) to your address: ([\d.]+) mi, about (\d+) min\.$/, m => `Ruta a pie desde la parada más cercana de ${m[1]} (${m[2]}) hasta tu dirección: ${m[3]} mi, unos ${m[4]} min.`],
        [/^Found (.+), but no walking route to the address is available\.$/, m => `Se encontró ${m[1]}, pero no hay una ruta a pie disponible hasta la dirección.`],
        [/^Found (.+), but walking directions could not be loaded\..*$/, m => `Se encontró ${m[1]}, pero no se pudieron cargar las indicaciones a pie. Revisa el token de Mapbox.`],
        [/^Pin added for (.+)\.$/, m => `Se marcó ${m[1]}.`],
        [/^No mapped bus stops found for (.+)\.$/, m => `No se encontraron paradas registradas para ${m[1]}.`],
        [/^Sending another invite to (.+)…$/, m => `Reenviando invitación a ${m[1]}…`],
        [/^Invite resent to (.+)\.$/, m => `Se reenvió la invitación a ${m[1]}.`],
        [/^Removing (.+)…$/, m => `Quitando el acceso de ${m[1]}…`],
        [/^(.+) no longer has access\.$/, m => `${m[1]} ya no tiene acceso.`],
        [/^Inviting (.+)…$/, m => `Invitando a ${m[1]}…`],
        [/^Invite sent to (.+)\. They can sign in as soon as they open it\.$/, m => `Se envió la invitación a ${m[1]}. Podrá iniciar sesión al abrirla.`],
        [/^(.+) was already added, so we sent the invite again\.$/, m => `${m[1]} ya estaba agregado; reenviamos la invitación.`]
    ];

    for (const [pattern, format] of patterns) {
        match = key.match(pattern);
        if (match) return format(match);
    }

    return value;
}

function translateNode(node) {
    const current = node.data;
    let state = nodeSources.get(node);

    if (!state || current !== state.rendered) state = { source: current };

    const leading = state.source.match(/^\s*/)?.[0] || "";
    const trailing = state.source.match(/\s*$/)?.[0] || "";
    const body = state.source.slice(leading.length, state.source.length - trailing.length || undefined);
    const rendered = `${leading}${translate(body)}${trailing}`;
    state.rendered = rendered;
    nodeSources.set(node, state);
    if (current !== rendered) node.data = rendered;
}

function translateAttribute(element, attribute) {
    let attributes = attributeSources.get(element);
    if (!attributes) {
        attributes = new Map();
        attributeSources.set(element, attributes);
    }

    const current = element.getAttribute(attribute);
    let state = attributes.get(attribute);
    if (!state || current !== state.rendered) state = { source: current };

    const rendered = translate(state.source);
    state.rendered = rendered;
    attributes.set(attribute, state);
    if (current !== rendered) element.setAttribute(attribute, rendered);
}

function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
        translateNode(root);
        return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateNode(node);

    const elements = [root, ...root.querySelectorAll("*")];
    for (const element of elements) {
        for (const attribute of ["placeholder", "aria-label", "aria-roledescription", "label"]) {
            if (element.hasAttribute(attribute)) translateAttribute(element, attribute);
        }
    }
}

function setLanguage(nextLanguage) {
    language = languages.has(nextLanguage) ? nextLanguage : "en";
    document.documentElement.lang = language;
    translateTree(document.body);

    const title = document.querySelector("title");
    if (title) {
        const original = title.dataset.originalTitle || title.textContent;
        title.dataset.originalTitle = original;
        title.textContent = translate(original);
    }

    const selector = document.getElementById("language-select");
    if (selector) selector.value = language;
}

try {
    setLanguage(localStorage.getItem(languageKey) || "en");
} catch (error) {
    console.warn("Could not read language preference.", error);
    setLanguage("en");
}

document.getElementById("language-select")?.addEventListener("change", event => {
    setLanguage(event.currentTarget.value);
    try {
        localStorage.setItem(languageKey, language);
    } catch (error) {
        console.warn("Could not save language preference.", error);
    }
});

new MutationObserver(records => {
    for (const record of records) {
        if (record.type === "characterData") {
            translateNode(record.target);
        } else {
            for (const added of record.addedNodes) {
                if (added.nodeType === Node.TEXT_NODE) translateNode(added);
                else if (added.nodeType === Node.ELEMENT_NODE) translateTree(added);
            }
        }
    }
}).observe(document.body, { childList: true, characterData: true, subtree: true });
